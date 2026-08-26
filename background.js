const DEFAULT_BLOCKED = ["instagram.com", "reddit.com", "x.com", "twitter.com"];

// Hash function to generate a unique, deterministic rule ID for any domain (for session bypass rules)
function getRuleIdForDomain(domain) {
  let hash = 0;
  for (let i = 0; i < domain.length; i++) {
    hash = (hash << 5) - hash + domain.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  // Ensure it's a positive integer between 100000 and 900000 (avoiding overlap with dynamic rules 1-100)
  return Math.abs(hash) % 800000 + 100000;
}

// Function to generate and apply dynamic redirect rules based on storage state
function setupDynamicRules() {
  chrome.storage.local.get({ blockedDomains: DEFAULT_BLOCKED }, (result) => {
    const activeDomains = result.blockedDomains;
    const extensionId = chrome.runtime.id;
    const redirectUrl = `chrome-extension://${extensionId}/blocked.html?target=\\0`;

    const rules = activeDomains.map((domain, index) => {
      return {
        id: index + 1, // Dynamic rule IDs start at 1
        priority: 1,
        action: {
          type: "redirect",
          redirect: { regexSubstitution: redirectUrl }
        },
        condition: {
          regexFilter: `^https?://([^/]*\\.)?${domain.replace(/\./g, "\\.")}([/:]|$)`,
          resourceTypes: ["main_frame"]
        }
      };
    });

    chrome.declarativeNetRequest.getDynamicRules((existingRules) => {
      const existingIds = existingRules.map(r => r.id);
      
      const updatePayload = {
        removeRuleIds: existingIds
      };

      if (rules.length > 0) {
        updatePayload.addRules = rules;
      }

      chrome.declarativeNetRequest.updateDynamicRules(updatePayload, () => {
        if (chrome.runtime.lastError) {
          console.error("Failed to update dynamic rules:", chrome.runtime.lastError);
        } else {
          console.log(`Successfully registered dynamic redirect rules for: ${activeDomains.join(', ')}`);
        }
      });
    });
  });
}

// Helper to clear any persisted session rules and storage bypasses (to ensure clean slate on restart/reload)
function clearAllSessionRules() {
  chrome.declarativeNetRequest.getSessionRules((rules) => {
    const ids = rules.map(r => r.id);
    if (ids.length > 0) {
      chrome.declarativeNetRequest.updateSessionRules({
        removeRuleIds: ids
      }, () => {
        if (chrome.runtime.lastError) {
          console.error("Failed to clear session rules:", chrome.runtime.lastError);
        } else {
          console.log("Successfully cleared stale session rules.");
        }
      });
    }
  });
  // Reset any active tab bypasses
  chrome.storage.local.remove("activeBypasses");
}

// Storage-backed active bypasses mapping tabId -> Array of domains
function addBypass(tabId, domain, durationMs = 15000) {
  chrome.storage.local.get({ activeBypasses: {} }, (result) => {
    const bypasses = result.activeBypasses;
    if (!bypasses[tabId]) {
      bypasses[tabId] = [];
    }
    if (!bypasses[tabId].includes(domain)) {
      bypasses[tabId].push(domain);
    }
    chrome.storage.local.set({ activeBypasses: bypasses }, () => {
      setTimeout(() => {
        removeBypass(tabId, domain);
      }, durationMs);
    });
  });
}

function removeBypass(tabId, domain) {
  chrome.storage.local.get({ activeBypasses: {} }, (result) => {
    const bypasses = result.activeBypasses;
    if (bypasses[tabId]) {
      bypasses[tabId] = bypasses[tabId].filter(d => d !== domain);
      if (bypasses[tabId].length === 0) {
        delete bypasses[tabId];
      }
      chrome.storage.local.set({ activeBypasses: bypasses });
    }
  });
}

function checkBypass(tabId, domain, callback) {
  chrome.storage.local.get({ activeBypasses: {} }, (result) => {
    const bypasses = result.activeBypasses;
    const isBypassed = bypasses[tabId] && bypasses[tabId].includes(domain);
    callback(!!isBypassed);
  });
}

// Clean up bypasses when a tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.storage.local.get({ activeBypasses: {} }, (result) => {
    const bypasses = result.activeBypasses;
    if (bypasses[tabId]) {
      delete bypasses[tabId];
      chrome.storage.local.set({ activeBypasses: bypasses });
    }
  });
});

// Run on install / reload
chrome.runtime.onInstalled.addListener(() => {
  clearAllSessionRules();
  chrome.storage.local.get("blockedDomains", (result) => {
    let activeBlocked = result.blockedDomains;
    if (!activeBlocked) {
      // Clean installation
      chrome.storage.local.set({ blockedDomains: DEFAULT_BLOCKED }, () => {
        setupDynamicRules();
      });
    } else {
      // Migration: Ensure new defaults (like x.com/twitter.com) are added to existing users' storage
      let migrated = false;
      DEFAULT_BLOCKED.forEach(domain => {
        if (!activeBlocked.includes(domain)) {
          activeBlocked.push(domain);
          migrated = true;
        }
      });

      if (migrated) {
        chrome.storage.local.set({ blockedDomains: activeBlocked }, () => {
          setupDynamicRules();
        });
      } else {
        setupDynamicRules();
      }
    }
  });
});

// Run on browser startup
chrome.runtime.onStartup.addListener(() => {
  clearAllSessionRules();
  setupDynamicRules();
});

// Listen for storage updates to dynamically sync DNR rules
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && changes.blockedDomains) {
    setupDynamicRules();
  }
});

// Listen for messages from the blocked page (quotes.js) or content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const tabId = sender.tab ? sender.tab.id : null;

  if (message.action === "unblock" && message.domain && tabId) {
    const domain = message.domain;

    // Handle cross-domain unblocking for x.com and twitter.com (they redirect to each other)
    const domainsToUnblock = [];
    if (domain === "x.com" || domain === "twitter.com") {
      domainsToUnblock.push("x.com", "twitter.com");
    } else {
      domainsToUnblock.push(domain);
    }

    const rulesToAdd = domainsToUnblock.map(dom => {
      const ruleId = getRuleIdForDomain(dom);
      return {
        id: ruleId,
        priority: 3, // Higher than dynamic redirect rules (1)
        action: {
          type: "allow"
        },
        condition: {
          urlFilter: `||${dom}`,
          tabIds: [tabId],
          resourceTypes: ["main_frame"]
        }
      };
    });

    const ruleIdsToRemove = domainsToUnblock.map(dom => getRuleIdForDomain(dom));

    console.log(`Unblocking domains: ${domainsToUnblock.join(", ")} on tab ${tabId} for 15 seconds`);

    // 1. Add storage-backed bypasses for the Content Script check
    domainsToUnblock.forEach(dom => {
      addBypass(tabId, dom, 15000);
    });

    // 2. Add declarativeNetRequest session rules for the network stack
    chrome.declarativeNetRequest.updateSessionRules({
      addRules: rulesToAdd,
      removeRuleIds: ruleIdsToRemove // Clear existing rules first
    }, () => {
      if (chrome.runtime.lastError) {
        console.error("Failed to add session rules:", chrome.runtime.lastError);
      } else {
        console.log(`Successfully added session rules for ${domainsToUnblock.join(", ")} on tab ${tabId}`);
        
        // Remove the session rules after 15 seconds so any future navigation/refresh blocks the site again
        setTimeout(() => {
          chrome.declarativeNetRequest.updateSessionRules({
            removeRuleIds: ruleIdsToRemove
          }, () => {
            if (chrome.runtime.lastError) {
              console.error("Failed to remove session rules:", chrome.runtime.lastError);
            } else {
              console.log(`Bypass time elapsed. Re-blocked domains: ${domainsToUnblock.join(", ")} on tab ${tabId}`);
            }
          });
        }, 15000);
      }
      sendResponse({ success: true });
    });

    return true; // Keep message channel open for async sendResponse
  }

  if (message.action === "checkBlocked" && message.url && tabId) {
    const url = message.url;
    let urlDomain = "";
    try {
      const urlObj = new URL(url);
      urlDomain = urlObj.hostname.replace("www.", "");
    } catch (e) {
      urlDomain = url;
    }

    chrome.storage.local.get({ blockedDomains: DEFAULT_BLOCKED }, (result) => {
      const activeDomains = result.blockedDomains;
      
      // Match the domain or subdomains
      const matchedDomain = activeDomains.find(domain => {
        return urlDomain === domain || urlDomain.endsWith("." + domain);
      });

      if (!matchedDomain) {
        // Not a blocked domain
        sendResponse({ shouldBlock: false });
        return;
      }

      // Check if it is currently bypassed for this tab
      checkBypass(tabId, matchedDomain, (isBypassed) => {
        sendResponse({ shouldBlock: !isBypassed });
      });
    });

    return true; // Keep message channel open for async sendResponse
  }
});

