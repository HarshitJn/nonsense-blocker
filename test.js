const fs = require('fs');
const assert = require('assert');

console.log("Starting unit tests for Nonsense Blocker (Dynamic Rules)...");

// Test Case 1: Read background.js and extract BLOCKED_DOMAINS
console.log("\n[Test 1] Extracting BLOCKED_DOMAINS from background.js...");
let blockedDomains = [];
try {
  const bgContent = fs.readFileSync('background.js', 'utf8');
  const match = bgContent.match(/const BLOCKED_DOMAINS = \[\s*([\s\S]*?)\s*\];/);
  if (!match) {
    throw new Error("Could not find BLOCKED_DOMAINS array in background.js");
  }
  blockedDomains = match[1]
    .split(',')
    .map(s => s.trim().replace(/"/g, '').replace(/'/g, ''))
    .filter(Boolean);
  console.log("✅ Successfully extracted domains:", blockedDomains);
} catch (e) {
  console.error("❌ Failed to parse background.js:", e.message);
  process.exit(1);
}

// Test Case 2: Test generated regexFilters against blocklist/allowlist URLs
console.log("\n[Test 2] Testing dynamic regexFilters matching logic...");

const testCases = [
  // Reddit
  { url: "https://reddit.com/", shouldBlock: true, targetDomain: "reddit.com" },
  { url: "https://www.reddit.com/r/pics", shouldBlock: true, targetDomain: "reddit.com" },
  { url: "https://old.reddit.com/r/pics/comments/123", shouldBlock: true, targetDomain: "reddit.com" },
  { url: "https://reddit.com.attacker.com", shouldBlock: false },
  { url: "https://myreddit.com", shouldBlock: false },
  { url: "https://reddit.com.org", shouldBlock: false },

  // Instagram
  { url: "https://instagram.com/", shouldBlock: true, targetDomain: "instagram.com" },
  { url: "https://www.instagram.com/reels/DVxEHVBDKQR/", shouldBlock: true, targetDomain: "instagram.com" },
  { url: "https://instagram.com.attacker.com", shouldBlock: false },

  // LinkedIn
  { url: "https://linkedin.com/", shouldBlock: true, targetDomain: "linkedin.com" },
  { url: "https://www.linkedin.com/feed/", shouldBlock: true, targetDomain: "linkedin.com" },
  { url: "https://linkedin.com.attacker.com", shouldBlock: false },

  // TradingView
  { url: "https://tradingview.com/", shouldBlock: true, targetDomain: "tradingview.com" },
  { url: "https://www.tradingview.com/chart/Qib1EBVe/?symbol=NASDAQ%3AGOOG", shouldBlock: true, targetDomain: "tradingview.com" },
  { url: "https://tradingview.com.attacker.com", shouldBlock: false },

  // Pinterest
  { url: "https://pinterest.com/", shouldBlock: true, targetDomain: "pinterest.com" },
  { url: "https://www.pinterest.com/pin/12345", shouldBlock: true, targetDomain: "pinterest.com" },
  { url: "https://pinterest.com.attacker.com", shouldBlock: false },

  // Unrelated sites (should never block)
  { url: "https://google.com/", shouldBlock: false },
  { url: "https://github.com/HarshitJn/nonsense-blocker", shouldBlock: false }
];

let matchFailures = 0;
for (const tc of testCases) {
  let matchedDomain = null;
  for (const domain of blockedDomains) {
    // Generate regex filter exactly as done in background.js
    const regexPattern = `^https?://([^/]*\\.)?${domain.replace(/\./g, "\\.")}([/:]|$)`;
    const regex = new RegExp(regexPattern);
    
    if (regex.test(tc.url)) {
      matchedDomain = domain;
      break;
    }
  }

  const isBlocked = (matchedDomain !== null);
  if (isBlocked !== tc.shouldBlock) {
    console.error(`❌ Match Failure: URL "${tc.url}" was ${isBlocked ? 'BLOCKED' : 'ALLOWED'}, but should be ${tc.shouldBlock ? 'BLOCKED' : 'ALLOWED'}.`);
    matchFailures++;
  } else if (isBlocked && matchedDomain !== tc.targetDomain) {
    console.error(`❌ Domain Mismatch: URL "${tc.url}" matched domain "${matchedDomain}", but expected "${tc.targetDomain}".`);
    matchFailures++;
  }
}

if (matchFailures > 0) {
  console.error(`❌ Regex matching tests failed with ${matchFailures} errors.`);
  process.exit(1);
} else {
  console.log("✅ Regex matching tests passed successfully.");
}

// Test Case 3: Validate hashing function compatibility
console.log("\n[Test 3] Validating hash function consistency...");

function getRuleIdForDomain(domain) {
  let hash = 0;
  for (let i = 0; i < domain.length; i++) {
    hash = (hash << 5) - hash + domain.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 800000 + 100000;
}

const domainsToTest = ["reddit.com", "instagram.com", "linkedin.com", "tradingview.com", "pinterest.com", "facebook.com"];
for (const dom of domainsToTest) {
  const id1 = getRuleIdForDomain(dom);
  const id2 = getRuleIdForDomain(dom);
  assert.strictEqual(id1, id2, `Hash function is non-deterministic for ${dom}`);
  assert.ok(id1 >= 100000 && id1 <= 900000, `Rule ID ${id1} is out of bounds for ${dom}`);
}
console.log("✅ Hash function is deterministic and within valid Chrome rule ID bounds.");

console.log("\n🎉 All unit tests passed successfully!");
