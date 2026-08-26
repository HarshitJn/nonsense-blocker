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

// Run on install / reload
chrome.runtime.onInstalled.addListener(() => {
  // Initialize default storage values if not set
  chrome.storage.local.get("blockedDomains", (result) => {
    if (!result.blockedDomains) {
      chrome.storage.local.set({ blockedDomains: DEFAULT_BLOCKED }, () => {
        setupDynamicRules();
      });
    } else {
      setupDynamicRules();
    }
  });
});

// Run on browser startup
chrome.runtime.onStartup.addListener(() => {
  setupDynamicRules();
});

// Listen for storage updates to dynamically sync DNR rules
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && changes.blockedDomains) {
    setupDynamicRules();
  }
});

// Listen for messages from the blocked page (quotes.js)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "unblock" && message.domain && sender.tab && sender.tab.id) {
    const domain = message.domain;
    const tabId = sender.tab.id;

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

    // Add session rules to allow this domain (restricted to the requesting tab)
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
});

