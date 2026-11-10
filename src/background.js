// chrome.commands.onCommand.addListener(async (command) => {
//   const [tab] = await chrome.tabs.query({
//     active: true,
//     currentWindow: true,
//   });

//   if (!tab?.id) return;

//   chrome.tabs.sendMessage(tab.id, {
//     type: "KEYBOARD_COMMAND",
//     command,
//   });
// });

let tabPlanWindowId = null;

async function openTabPlan() {
  // Reuse existing window if available
  if (tabPlanWindowId !== null) {
    try {
      await chrome.windows.get(tabPlanWindowId);
      await chrome.windows.update(tabPlanWindowId, {
        focused: true,
      });
      return;
    } catch {
      tabPlanWindowId = null;
    }
  }

  // Open your React application
  const win = await chrome.windows.create({
    url: chrome.runtime.getURL("index.html"),
    type: "popup",
    width: 1100,
    height: 750,
    focused: true,
  });

  tabPlanWindowId = win.id;
}

// Extension icon click
chrome.action.onClicked.addListener(openTabPlan);

// Keyboard shortcut
chrome.commands.onCommand.addListener((command) => {
  if (command === "toggle-tabplan") {
    openTabPlan();
  }
});

// Reset when window closes
chrome.windows.onRemoved.addListener((windowId) => {
  if (windowId === tabPlanWindowId) {
    tabPlanWindowId = null;
  }
});
