const DEFAULT_SUSPECTS = {
  "instagram.com": "toggle-instagram",
  "reddit.com": "toggle-reddit",
  "linkedin.com": "toggle-linkedin",
  "tradingview.com": "toggle-tradingview",
  "pinterest.com": "toggle-pinterest"
};

const customListEl = document.getElementById("custom-domains-list");
const customInputEl = document.getElementById("custom-domain-input");
const addBtnEl = document.getElementById("add-custom-btn");

let activeBlockedDomains = [];

// Helper to clean input URL into a clean domain name
function cleanDomain(input) {
  let domain = input.trim().toLowerCase();
  if (domain.startsWith("http://")) domain = domain.substring(7);
  if (domain.startsWith("https://")) domain = domain.substring(8);
  const slashIndex = domain.indexOf("/");
  if (slashIndex !== -1) {
    domain = domain.substring(0, slashIndex);
  }
  if (domain.startsWith("www.")) {
    domain = domain.substring(4);
  }
  return domain;
}

// Render the list of custom domains
function renderCustomList() {
  customListEl.innerHTML = "";
  
  const customDomains = activeBlockedDomains.filter(domain => !DEFAULT_SUSPECTS[domain]);
  
  if (customDomains.length === 0) {
    customListEl.innerHTML = '<div class="empty-state">No custom domains added</div>';
    return;
  }

  customDomains.forEach(domain => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "custom-item";
    
    const textSpan = document.createElement("span");
    textSpan.innerText = domain;
    
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.innerHTML = "×";
    deleteBtn.addEventListener("click", () => {
      removeDomain(domain);
    });

    itemDiv.appendChild(textSpan);
    itemDiv.appendChild(deleteBtn);
    customListEl.appendChild(itemDiv);
  });
}

// Save activeBlockedDomains to storage
function saveToStorage() {
  chrome.storage.local.set({ blockedDomains: activeBlockedDomains }, () => {
    if (chrome.runtime.lastError) {
      console.error("Error saving storage:", chrome.runtime.lastError);
    }
  });
}

// Remove a domain from block list
function removeDomain(domain) {
  activeBlockedDomains = activeBlockedDomains.filter(d => d !== domain);
  renderCustomList();
  saveToStorage();
}

// Initialize interface from storage
function initializeUI() {
  // Default to Instagram and Reddit enabled if storage is not set yet
  chrome.storage.local.get({ blockedDomains: ["instagram.com", "reddit.com"] }, (result) => {
    activeBlockedDomains = result.blockedDomains;

    // Set checkboxes for default suspects
    for (const [domain, elementId] of Object.entries(DEFAULT_SUSPECTS)) {
      const checkbox = document.getElementById(elementId);
      if (checkbox) {
        checkbox.checked = activeBlockedDomains.includes(domain);
        
        // Add change listener to save checkboxes dynamically
        checkbox.addEventListener("change", () => {
          if (checkbox.checked) {
            if (!activeBlockedDomains.includes(domain)) {
              activeBlockedDomains.push(domain);
            }
          } else {
            activeBlockedDomains = activeBlockedDomains.filter(d => d !== domain);
          }
          saveToStorage();
        });
      }
    }

    renderCustomList();
  });
}

// Add new custom domain event handler
function handleAddCustomDomain() {
  const rawInput = customInputEl.value;
  const domain = cleanDomain(rawInput);

  if (!domain) return;

  if (activeBlockedDomains.includes(domain)) {
    customInputEl.value = "";
    // Visual feedback for duplicate
    customInputEl.style.borderColor = "#ef4444";
    setTimeout(() => {
      customInputEl.style.borderColor = "rgba(255, 255, 255, 0.1)";
    }, 1000);
    return;
  }

  activeBlockedDomains.push(domain);
  customInputEl.value = "";
  renderCustomList();
  saveToStorage();
}

// Event Listeners
addBtnEl.addEventListener("click", handleAddCustomDomain);
customInputEl.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    handleAddCustomDomain();
  }
});

// Load the UI
document.addEventListener("DOMContentLoaded", initializeUI);
