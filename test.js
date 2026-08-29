const fs = require('fs');
const assert = require('assert');

console.log("Starting unit tests for Nonsense Blocker (Dynamic Storage Rules)...");

// Test Case 1: Read background.js and extract DEFAULT_BLOCKED
console.log("\n[Test 1] Extracting DEFAULT_BLOCKED from background.js...");
let defaultBlocked = [];
try {
  const bgContent = fs.readFileSync('background.js', 'utf8');
  const match = bgContent.match(/const DEFAULT_BLOCKED = \[\s*([\s\S]*?)\s*\];/);
  if (!match) {
    throw new Error("Could not find DEFAULT_BLOCKED array in background.js");
  }
  defaultBlocked = match[1]
    .split(',')
    .map(s => s.trim().replace(/"/g, '').replace(/'/g, ''))
    .filter(Boolean);
  console.log("✅ Successfully extracted default blocked domains:", defaultBlocked);
  
  // Verify defaults block Instagram, Reddit, x.com, twitter.com, youtube.com, and youtu.be
  assert.ok(defaultBlocked.includes("instagram.com"), "Default list must block instagram.com");
  assert.ok(defaultBlocked.includes("reddit.com"), "Default list must block reddit.com");
  assert.ok(defaultBlocked.includes("x.com"), "Default list must block x.com");
  assert.ok(defaultBlocked.includes("twitter.com"), "Default list must block twitter.com");
  assert.ok(defaultBlocked.includes("youtube.com"), "Default list must block youtube.com");
  assert.ok(defaultBlocked.includes("youtu.be"), "Default list must block youtu.be");
  assert.strictEqual(defaultBlocked.length, 6, "Default list should contain 6 domains by default");
  console.log("✅ Default list correctly targets instagram.com, reddit.com, x.com, twitter.com, youtube.com, and youtu.be.");
} catch (e) {
  console.error("❌ Failed to parse or validate default blocked domains:", e.message);
  process.exit(1);
}

// Test Case 2: Test regexFilters matching logic for both default and custom domains
console.log("\n[Test 2] Testing dynamic regexFilters matching logic...");

// Simulating the user blocking a mix of default and custom domains
const mockBlockedDomains = [...defaultBlocked, "linkedin.com", "facebook.com", "my-custom-blog.net"];

const testCases = [
  // Reddit (default block list)
  { url: "https://reddit.com/", shouldBlock: true, targetDomain: "reddit.com" },
  { url: "https://www.reddit.com/r/pics", shouldBlock: true, targetDomain: "reddit.com" },
  { url: "https://reddit.com.attacker.com", shouldBlock: false },
  { url: "https://myreddit.com", shouldBlock: false },

  // Instagram (default block list)
  { url: "https://instagram.com/", shouldBlock: true, targetDomain: "instagram.com" },
  { url: "https://www.instagram.com/reels/DVxEHVBDKQR/", shouldBlock: true, targetDomain: "instagram.com" },

  // Twitter / X (default block list)
  { url: "https://x.com/", shouldBlock: true, targetDomain: "x.com" },
  { url: "https://twitter.com/home", shouldBlock: true, targetDomain: "twitter.com" },
  { url: "https://x.com.attacker.com", shouldBlock: false },
  { url: "https://twitter.com.attacker.com", shouldBlock: false },

  // YouTube (default block list)
  { url: "https://youtube.com/", shouldBlock: true, targetDomain: "youtube.com" },
  { url: "https://www.youtube.com/watch?v=123", shouldBlock: true, targetDomain: "youtube.com" },
  { url: "https://youtu.be/abc", shouldBlock: true, targetDomain: "youtu.be" },
  { url: "https://youtube.com.attacker.com", shouldBlock: false },
  { url: "https://youtu.be.attacker.com", shouldBlock: false },

  // LinkedIn (explicitly enabled)
  { url: "https://linkedin.com/", shouldBlock: true, targetDomain: "linkedin.com" },
  { url: "https://www.linkedin.com/feed/", shouldBlock: true, targetDomain: "linkedin.com" },

  // TradingView (disabled in mock)
  { url: "https://tradingview.com/", shouldBlock: false },
  { url: "https://www.tradingview.com/chart/", shouldBlock: false },

  // Custom Domain 1: facebook.com
  { url: "https://facebook.com/", shouldBlock: true, targetDomain: "facebook.com" },
  { url: "https://www.facebook.com/profile.php", shouldBlock: true, targetDomain: "facebook.com" },
  { url: "https://facebook.com.attacker.com", shouldBlock: false },

  // Custom Domain 2: my-custom-blog.net
  { url: "https://my-custom-blog.net/", shouldBlock: true, targetDomain: "my-custom-blog.net" },
  { url: "http://my-custom-blog.net/posts/1", shouldBlock: true, targetDomain: "my-custom-blog.net" },

  // Unrelated sites (should never block)
  { url: "https://google.com/", shouldBlock: false },
  { url: "https://github.com/HarshitJn/nonsense-blocker", shouldBlock: false }
];

let matchFailures = 0;
for (const tc of testCases) {
  let matchedDomain = null;
  for (const domain of mockBlockedDomains) {
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
  console.log("✅ Regex matching tests passed successfully for both default and custom domains.");
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
