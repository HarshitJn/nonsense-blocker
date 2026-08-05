# Nonsense Blocker

Yeah social media is bad, screen time is ruinous, bla bla bla. Just use this tool to stop wasting your life.

## How It Works

You try to go to a distracting website. We block you and make you click a grid of tiles (moments of pause) to reveal quotes before letting you through. By the time you finish clicking, you might actually remember you have a life.

### What We Block by Default
* **Instagram** (influencer packing videos and mindless reels)
* **Reddit** (pointless arguments with strangers)
* **LinkedIn** (hustle cringe and B2B sales lessons from coffee cups)
* **TradingView** (watching red/green candles go up and down)
* **Pinterest** (boards for DIY projects you'll never start)

---

## Quick Setup (Chrome Local Mode)

1. **Download this folder**
   * **No Git:** Download the ZIP from GitHub and unzip it.
   * **With Git:** Run:
     ```bash
     git clone https://github.com/HarshitJn/nonsense-blocker.git
     ```
2. **Go to Chrome Settings**
   * Open Chrome and navigate to `chrome://extensions/`.
3. **Turn on Developer Mode**
   * Toggle the **Developer mode** switch in the top-right corner to **ON**.
4. **Load Unpacked**
   * Click **Load unpacked** (top-left) and select this folder.

Done. Go try opening Instagram.

---

## NO, I want to watch that reel NOW! (Bypass)

If you genuinely can't resist, append `?unblock=true` to the end of the URL:
- `https://instagram.com/?unblock=true`

---

## Want to block more nonsense?

1. Open [rules.json](file:///Users/harshit/.gemini/antigravity/scratch/nonsense-blocker/rules.json) and copy-paste an existing rule block. Give it a new `id` and change `urlFilter` to the site you want to block.
2. Open [manifest.json](file:///Users/harshit/.gemini/antigravity/scratch/nonsense-blocker/manifest.json) and add the domain to `host_permissions`.
3. Add a custom roasting message to `funnyCustomizations` in [quotes.js](file:///Users/harshit/.gemini/antigravity/scratch/nonsense-blocker/quotes.js) so you can get roasted dynamically.
4. Click the **Refresh (circular arrow)** button on the extension card in `chrome://extensions/`.
