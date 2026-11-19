import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Tab, Workspace } from "@src/type/workspace";

type BrowserTab = {
  id?: number;
  favIconUrl?: string;
  url?: string;
  title?: string;
  groupId?: number;
};

type BrowserWindow = {
  windowId?: number;
  tabs?: BrowserTab[];
};

type TabDataResponse = {
  success?: boolean;
  data?: BrowserWindow[];
};

function createUniqueId(usedIds: Set<number>): number {
  let id = Math.floor(Math.random() * 1_000_000);

  while (usedIds.has(id)) {
    id = Math.floor(Math.random() * 1_000_000);
  }

  usedIds.add(id);
  return id;
}

const filledWorkspaceData = createAsyncThunk<Workspace[]>(
  "workspace/fillWorkspaceData",
  async function (): Promise<Workspace[]> {
    const response = await new Promise<TabDataResponse>((resolve, reject) => {
      if (typeof chrome === "undefined" || !chrome.runtime?.sendMessage) {
        reject(new Error("Chrome runtime messaging is unavailable."));
        return;
      }

      chrome.runtime.sendMessage(
        { type: "GET_TAB_DATA" },
        (messageResponse: TabDataResponse | undefined) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
            return;
          }
          resolve(messageResponse ?? {});
        },
      );
    });

    if (response.success === false) {
      throw new Error("Unable to retrieve tab data.");
    }

    const usedIds = new Set<number>();
    const workspaceId = createUniqueId(usedIds);
    const tabsDatas = (response.data ?? []).map((browserWindow) => {
      const tabs: Tab[] = (browserWindow.tabs ?? []).map((tab) => ({
        id: createUniqueId(usedIds),
        favIconUrl: tab.favIconUrl ?? "",
        link: tab.url ?? "",
        title: tab.title ?? "Unknown",
        groupId: tab.groupId ?? 0,
      }));

      return {
        id: createUniqueId(usedIds),
        name: "Unknown",
        tabNumber: tabs.length,
        tabs,
      };
    });
    return [
      {
        id: workspaceId,
        workspaceName: "Unknown",
        projects: tabsDatas,
        res: response,
      },
    ];
  },
);

export { filledWorkspaceData };
