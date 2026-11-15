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

async function getAllWindowGroups() {
  const result = windows;
  // await Promise.all(
  //   windows.map(async (window) => {
  //     if (window.id === undefined) {
  //       throw new Error("Chrome returned a window without an id.");
  //     }

  //     const tabs = await browser.tabs.query({
  //       windowId: window.id,
  //     });

  //     const groups = await browser.tabGroups.query({
  //       windowId: window.id,
  //     });

  //     const groupsWithTabs = await Promise.all(
  //       groups.map(async (group) => {
  //         const tabs = await browser.tabs.query({
  //           groupId: group.id,
  //         });

  //         return {
  //           ...group,
  //           tabs,
  //         };
  //       }),
  //     );

  //     return {
  //       windowId: window.id,
  //       tabs,
  //       groups: groupsWithTabs,
  //     };
  //   }),
  // );

  return result;
}

// Usage
browser.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type !== "GET_TAB_DATA") {
    return false;
  }
  const windows = await browser.windows.getAll();
  const result = await Promise.all(
    windows.map(async (window) => {
      if (window.id === undefined) {
        throw new Error("Chrome returned a window without an id.");
      }

      const tabs = await browser.tabs.query({
        windowId: window.id,
      });

      const groups = await browser.tabGroups.query({
        windowId: window.id,
      });

      const groupsWithTabs = await Promise.all(
        groups.map(async (group) => {
          const tabs = await browser.tabs.query({
            groupId: group.id,
          });

          return {
            ...group,
            tabs,
          };
        }),
      );
      return {
        windowId: window.id,
        tabs,
        groups: groupsWithTabs,
      };
    }),
  );
  sendResponse({
    success: true,
    data: result,
  });
});
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
