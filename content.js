// Hide the page immediately to prevent any content flash
const hideStyle = document.createElement("style");
hideStyle.innerHTML = "html { display: none !important; }";
document.documentElement.appendChild(hideStyle);

// Check with the background service worker if this URL should be blocked
chrome.runtime.sendMessage({ action: "checkBlocked", url: window.location.href }, (response) => {
  if (chrome.runtime.lastError) {
    // If the extension context is invalidated or background isn't ready, let it load
    removeHideStyle();
    return;
  }

  if (response && response.shouldBlock) {
    // Redirect to the Pause Screen
    const redirectUrl = chrome.runtime.getURL(`blocked.html?target=${encodeURIComponent(window.location.href)}`);
    window.location.replace(redirectUrl);
  } else {
    // Allowed: reveal the page content
    removeHideStyle();
  }
});

function removeHideStyle() {
  if (hideStyle && hideStyle.parentNode) {
    hideStyle.parentNode.removeChild(hideStyle);
  }
}
