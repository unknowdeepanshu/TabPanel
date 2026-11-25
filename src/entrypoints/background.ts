import { browser } from "wxt/browser";
import { defineBackground } from "wxt/utils/define-background";

export default defineBackground(() => {
  browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    const handleMessage = async () => {
      switch (message.type) {
        case "GET_TAB_DATA":
          const windows = await browser.windows.getAll();
          const data = await Promise.all(
            windows.map(async (window) => {
              if (window.id === undefined) {
                throw new Error("Browser returned a window without an id.");
              }

              const tabs = await browser.tabs.query({ windowId: window.id });
              const groups = await browser.tabGroups.query({
                windowId: window.id,
              });
              const groupsWithTabs = await Promise.all(
                groups.map(async (group) => ({
                  ...group,
                  tabs: await browser.tabs.query({ groupId: group.id }),
                })),
              );

              return { windowId: window.id, tabs, groups: groupsWithTabs };
            }),
          );
          return { success: true, data };

        case "OPEN_ALL_TABS":
          const urls = message.urls as string[];
          const newWindow = await browser.windows.create({
            url: urls.length > 0 ? urls : undefined,
            type: "normal",
            focused: true,
            state: "maximized",
          });
          return {
            success: true,
            windowId: newWindow?.id,
            tabs: newWindow?.tabs,
          };
        case "CLOSE_ALL_TABS":
          const close = await browser.windows.remove(message.windowsId);
          return close;
        default:
          break;
      }
    };
    handleMessage()
      .then(sendResponse)
      .catch((error) => {
        sendResponse({
          success: false,
          error: error.message,
        });
      });

    return true;
  });
  // tracking browser tabs and windows
  browser.tabs.onCreated.addListener((tab) => {
    void browser.runtime
      .sendMessage({
        type: "TAB_CREATED",
        payload: tab,
      })
      .catch((error) => {
        console.log("No React listener available:", error);
      });
  });
  browser.tabs.onRemoved.addListener((tabId, removeInfo) => {
    browser.runtime
      .sendMessage({
        type: "TAB_REMOVED",
        payload: {
          tabId,
          windowId: removeInfo.windowId,
        },
      })
      .catch(() => {});
  });
  browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    browser.runtime
      .sendMessage({
        type: "TAB_UPDATED",
        payload: tab,
      })
      .catch(() => {});
  });
  // tracking browser windows
  browser.windows.onCreated.addListener((window) => {
    browser.runtime
      .sendMessage({
        type: "WINDOW_CREATED",
        payload: window,
      })
      .catch(() => {});
  });
  browser.windows.onRemoved.addListener((window) => {
    browser.runtime
      .sendMessage({
        type: "WINDOW_CLOSED",
        payload: window,
      })
      .catch(() => {});
  });

  let tabPlanWindowId: number | null = null;

  async function openTabPlan() {
    if (tabPlanWindowId !== null) {
      try {
        await browser.windows.get(tabPlanWindowId);
        await browser.windows.update(tabPlanWindowId, { focused: true });
        return;
      } catch {
        tabPlanWindowId = null;
      }
    }

    const window = await browser.windows.create({
      url: chrome.runtime.getURL("popup.html"),
      type: "popup",
      width: 1100,
      height: 750,
      focused: true,
    });

    tabPlanWindowId = window?.id ?? null;
  }

  browser.action.onClicked.addListener(() => {
    void openTabPlan();
  });

  browser.commands.onCommand.addListener((command) => {
    if (command === "toggle-tabplan") {
      void openTabPlan();
    }
  });

  browser.windows.onRemoved.addListener((windowId) => {
    if (windowId === tabPlanWindowId) {
      tabPlanWindowId = null;
    }
  });
});
