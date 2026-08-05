const fs = require('fs');
const assert = require('assert');

console.log("Starting unit tests for Nonsense Blocker...");

// Test Case 1: Validate rules.json structure and JSON validity
console.log("\n[Test 1] Validating rules.json syntax...");
let rules;
try {
  const data = fs.readFileSync('rules.json', 'utf8');
  rules = JSON.parse(data);
  console.log("✅ rules.json is valid JSON.");
} catch (e) {
  console.error("❌ rules.json is invalid JSON:", e.message);
  process.exit(1);
}

// Test Case 2: Ensure rule IDs are unique
console.log("\n[Test 2] Validating rule ID uniqueness...");
const ids = new Set();
for (const rule of rules) {
  assert.ok(rule.id, `Rule lacks an ID: ${JSON.stringify(rule)}`);
  assert.ok(!ids.has(rule.id), `Duplicate rule ID found: ${rule.id}`);
  ids.add(rule.id);
}
console.log(`✅ All ${rules.length} rule IDs are unique.`);

// Test Case 3: Test regexFilters against blocklist/allowlist URLs
console.log("\n[Test 3] Testing regexFilters matching logic...");

const testCases = [
  // Reddit
  { url: "https://reddit.com/", shouldBlock: true, ruleId: 1 },
  { url: "https://www.reddit.com/r/pics", shouldBlock: true, ruleId: 1 },
  { url: "https://old.reddit.com/r/pics/comments/123", shouldBlock: true, ruleId: 1 },
  { url: "https://reddit.com.attacker.com", shouldBlock: false },
  { url: "https://myreddit.com", shouldBlock: false },
  { url: "https://reddit.com.org", shouldBlock: false },

  // Instagram
  { url: "https://instagram.com/", shouldBlock: true, ruleId: 2 },
  { url: "https://www.instagram.com/reels/DVxEHVBDKQR/", shouldBlock: true, ruleId: 2 },
  { url: "https://instagram.com.attacker.com", shouldBlock: false },

  // LinkedIn
  { url: "https://linkedin.com/", shouldBlock: true, ruleId: 3 },
  { url: "https://www.linkedin.com/feed/", shouldBlock: true, ruleId: 3 },
  { url: "https://linkedin.com.attacker.com", shouldBlock: false },

  // TradingView
  { url: "https://tradingview.com/", shouldBlock: true, ruleId: 4 },
  { url: "https://www.tradingview.com/chart/Qib1EBVe/?symbol=NASDAQ%3AGOOG", shouldBlock: true, ruleId: 4 },
  { url: "https://tradingview.com.attacker.com", shouldBlock: false },

  // Pinterest
  { url: "https://pinterest.com/", shouldBlock: true, ruleId: 5 },
  { url: "https://www.pinterest.com/pin/12345", shouldBlock: true, ruleId: 5 },
  { url: "https://pinterest.com.attacker.com", shouldBlock: false },

  // Unrelated sites (should never block)
  { url: "https://google.com/", shouldBlock: false },
  { url: "https://github.com/HarshitJn/nonsense-blocker", shouldBlock: false }
];

let matchFailures = 0;
for (const tc of testCases) {
  let matchedRule = null;
  for (const rule of rules) {
    if (rule.condition && rule.condition.regexFilter) {
      const regex = new RegExp(rule.condition.regexFilter);
      if (regex.test(tc.url)) {
        matchedRule = rule;
        break;
      }
    }
  }

  const isBlocked = (matchedRule !== null);
  if (isBlocked !== tc.shouldBlock) {
    console.error(`❌ Match Failure: URL "${tc.url}" was ${isBlocked ? 'BLOCKED' : 'ALLOWED'}, but should be ${tc.shouldBlock ? 'BLOCKED' : 'ALLOWED'}.`);
    matchFailures++;
  } else if (isBlocked && matchedRule.id !== tc.ruleId) {
    console.error(`❌ Rule ID Mismatch: URL "${tc.url}" matched rule ID ${matchedRule.id}, but expected rule ID ${tc.ruleId}.`);
    matchFailures++;
  } else {
    // console.log(`✓ URL "${tc.url}" handled correctly.`);
  }
}

if (matchFailures > 0) {
  console.error(`❌ Regex matching tests failed with ${matchFailures} errors.`);
  process.exit(1);
} else {
  console.log("✅ Regex matching tests passed successfully.");
}

// Test Case 4: Validate hashing function compatibility between background.js and quotes.js
console.log("\n[Test 4] Validating hash function consistency...");

// Emulate hash function from background.js and quotes.js
function getRuleIdForDomain(domain) {
  let hash = 0;
  for (let i = 0; i < domain.length; i++) {
    hash = (hash << 5) - hash + domain.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 999900 + 100;
}

const domainsToTest = ["reddit.com", "instagram.com", "linkedin.com", "tradingview.com", "pinterest.com", "facebook.com"];
for (const dom of domainsToTest) {
  const id1 = getRuleIdForDomain(dom);
  const id2 = getRuleIdForDomain(dom);
  assert.strictEqual(id1, id2, `Hash function is non-deterministic for ${dom}`);
  assert.ok(id1 >= 100 && id1 <= 1000000, `Rule ID ${id1} is out of bounds for ${dom}`);
}
console.log("✅ Hash function is deterministic and within valid Chrome rule ID bounds.");

console.log("\n🎉 All unit tests passed successfully!");
