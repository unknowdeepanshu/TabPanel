import { browser } from "wxt/browser";
import { defineBackground } from "wxt/utils/define-background";

export default defineBackground(() => {
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

  browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type !== "GET_TAB_DATA") {
      return false;
    }

    void (async () => {
      const windows = await browser.windows.getAll();
      const data = await Promise.all(
        windows.map(async (window) => {
          if (window.id === undefined) {
            throw new Error("Browser returned a window without an id.");
          }

          const tabs = await browser.tabs.query({ windowId: window.id });
          const groups = await browser.tabGroups.query({ windowId: window.id });
          const groupsWithTabs = await Promise.all(
            groups.map(async (group) => ({
              ...group,
              tabs: await browser.tabs.query({ groupId: group.id }),
            })),
          );

          return { windowId: window.id, tabs, groups: groupsWithTabs };
        }),
      );

      sendResponse({ success: true, data, check: windows });
    })().catch((error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      sendResponse({ success: false, error: errorMessage });
    });

    return true;
  });
  browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message !== "session") {
      return false;
    }

    void (async () => {
      try {
        const data = await browser.sessions.getDevices();

        sendResponse({
          success: true,
          data,
        });
      } catch (error) {
        sendResponse({
          success: false,
          error: String(error),
        });
      }
    })();

    return true;
  });

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
