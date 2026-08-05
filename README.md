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

### Step 1: Download the Extension Folder
You can get the extension folder onto your local laptop in one of two ways:
* **Option A (No Git required):** Go to the GitHub repository page at `https://github.com/HarshitJn/nonsense-blocker`, click the green **Code** button, select **Download ZIP**, and then extract/unzip the downloaded file on your computer.
* **Option B (Using Git):** Run the following command in your terminal:
  ```bash
  git clone https://github.com/HarshitJn/nonsense-blocker.git
  ```

### Step 2: Open Chrome Extension Settings
1. Open Google Chrome.
2. Navigate to `chrome://extensions/` by typing it into your address bar, or click the **three dots menu** (top right) -> **Extensions** -> **Manage Extensions**.

### Step 3: Enable Developer Mode
1. In the top right corner of the Extensions page, toggle the **Developer mode** switch to **ON**.

### Step 4: Load the Unpacked Extension
1. Click the **Load unpacked** button that appears in the top-left corner.
2. Select the extracted `nonsense-blocker` folder (make sure you select the root folder that contains the `manifest.json` file directly).

The extension is now installed and active!

---

## How to Temporarily Bypass the Blocker

If you genuinely need to access a blocked site (e.g., for work or an important update), you can append `?unblock=true` to the URL. For example:
- `https://www.linkedin.com/?unblock=true`

---

## How to Customize Blocked Websites (rules.json)

You can easily add new websites to block or remove the existing ones by modifying two files:

### 1. Update `rules.json`
Open [rules.json](file:///Users/harshit/.gemini/antigravity/scratch/nonsense-blocker/rules.json) and add a new rule object at the end of the array. Make sure to:
- Give it a unique `id` number.
- Replace `example.com` with the domain you want to block.
- Point the redirect to `blocked.html?target=https://www.example.com/`.

Example rule format:
```json
{
  "id": 7,
  "priority": 1,
  "action": {
    "type": "redirect",
    "redirect": { "extensionPath": "/blocked.html?target=https://www.facebook.com/" }
  },
  "condition": {
    "urlFilter": "||facebook.com",
    "resourceTypes": ["main_frame"]
  }
}
```

### 2. Update `manifest.json`
Open [manifest.json](file:///Users/harshit/.gemini/antigravity/scratch/nonsense-blocker/manifest.json) and add the new domain to the `host_permissions` list so the extension has permission to run on that site:
```json
"host_permissions": [
  "*://*.reddit.com/*",
  "*://*.facebook.com/*" // Add your new site here
]
```

### 3. Add Custom Funny Descriptions (Optional)
Open [quotes.js](file:///Users/harshit/.gemini/antigravity/scratch/nonsense-blocker/quotes.js) and scroll to `funnyCustomizations`. You can define a customized message and emoji for your new website to nudge you dynamically:
```javascript
"facebook.com": {
  icon: "👥",
  title: "A classic distraction!",
  subtitle: "Need to check updates from people you haven't seen in 10 years? Sure, do your moments of pause first."
}
```

*Note: After making any edits, go back to `chrome://extensions/` and click the **Refresh (circular arrow)** button on the Nonsense Blocker card to apply the changes.*

