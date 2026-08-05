// Hash function to generate a unique, deterministic rule ID for any domain
function getRuleIdForDomain(domain) {
  let hash = 0;
  for (let i = 0; i < domain.length; i++) {
    hash = (hash << 5) - hash + domain.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  // Ensure it's a positive integer between 100 and 1000000
  return Math.abs(hash) % 999900 + 100;
}

// Listen for messages from the blocked page (quotes.js)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "unblock" && message.domain) {
    const domain = message.domain;
    const ruleId = getRuleIdForDomain(domain);

    console.log(`Unblocking domain: ${domain} (Rule ID: ${ruleId}) for 10 minutes`);

    // Add session rule to allow this domain (overriding redirect rules)
    chrome.declarativeNetRequest.updateSessionRules({
      addRules: [{
        id: ruleId,
        priority: 3, // Higher than static rules (1) and unblock=true rule (2)
        action: {
          type: "allow"
        },
        condition: {
          urlFilter: `||${domain}`,
          resourceTypes: ["main_frame"]
        }
      }],
      removeRuleIds: [ruleId] // Clear existing rule with same ID first
    }, () => {
      if (chrome.runtime.lastError) {
        console.error("Failed to add session rule:", chrome.runtime.lastError);
      } else {
        console.log(`Successfully added session rule for ${domain}`);
        
        // Schedule alarm to re-block after 10 minutes
        chrome.alarms.create(`block-${domain}`, { delayInMinutes: 10 });
      }
      sendResponse({ success: true });
    });

    return true; // Keep message channel open for async sendResponse
  }
});

// Listen for alarms to re-block domains
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name.startsWith("block-")) {
    const domain = alarm.name.substring(6);
    const ruleId = getRuleIdForDomain(domain);

    console.log(`Time is up! Re-blocking domain: ${domain} (Removing Rule ID: ${ruleId})`);

    chrome.declarativeNetRequest.updateSessionRules({
      removeRuleIds: [ruleId]
    }, () => {
      if (chrome.runtime.lastError) {
        console.error("Failed to remove session rule:", chrome.runtime.lastError);
      } else {
        console.log(`Successfully removed session rule for ${domain}. Domain is blocked again.`);
      }
    });
  }
});
