# Nonsense Blocker

A simple and lightweight Google Chrome extension to help you stay focused by blocking distracting websites locally and displaying motivational/thought-provoking quotes instead.

## How It Works

When you visit any of the configured distracting websites, the extension automatically redirects your browser to a local page (`blocked.html`) containing an inspirational quote to nudge you back to productivity.

### Blocked Websites by Default
- Reddit (`reddit.com`)
- Instagram (`instagram.com`)
- LinkedIn (`linkedin.com`)
- TradingView (`tradingview.com`)
- Pinterest (`pinterest.com`)

---

## How to Install and Use (Developer / Unpacked Mode)

Since this extension is not published to the Chrome Web Store, you can load it locally on your laptop using Chrome's Developer Mode:

### Step 1: Open Chrome Extension Settings
1. Open Google Chrome.
2. Navigate to `chrome://extensions/` by typing it into your address bar, or click the **three dots menu** (top right) -> **Extensions** -> **Manage Extensions**.

### Step 2: Enable Developer Mode
1. In the top right corner of the Extensions page, toggle the **Developer mode** switch to **ON**.

### Step 3: Load the Unpacked Extension
1. Click the **Load unpacked** button that appears in the top-left corner.
2. Select the `nonsense-blocker` folder containing the extension files (make sure you select the root folder that has `manifest.json` directly inside it).

The extension is now installed and active!

---

## How to Temporarily Bypass the Blocker

If you genuinely need to access a blocked site (e.g., for work or an important update), you can append `?unblock=true` to the URL. For example:
- `https://www.linkedin.com/?unblock=true`
