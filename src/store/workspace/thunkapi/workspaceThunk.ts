import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Tab, Workspace } from "@src/type/workspace";
import { createUniqueId, usedIds } from "@src/utils/creationId";

type BrowserTab = {
  id?: number;
  favIconUrl?: string;
  url?: string;
  title?: string;
  groupId?: number;
};

type BrowserWindow = {
  windowId?: number | undefined;
  tabs?: BrowserTab[];
};

type TabDataResponse = {
  success?: boolean;
  data?: BrowserWindow[];
};

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

    const workspaceId = createUniqueId(usedIds);
    const tabsDatas = (response.data ?? []).map((browserWindow) => {
      const tabs: Tab[] = (browserWindow.tabs ?? []).map((tab) => ({
        id: tab.id ?? createUniqueId(usedIds),
        favIconUrl: tab.favIconUrl ?? "",
        link: tab.url ?? "",
        title: tab.title ?? "Unknown",
        groupId: tab.groupId ?? 0,
      }));

      return {
        id: browserWindow.windowId ?? createUniqueId(usedIds),
        name: "Untitled Project",
        tabNumber: tabs.length,
        tabs,
      };
    });
    return [
      {
        id: workspaceId,
        workspaceName: "Untitled workspace",
        projects: tabsDatas,
        res: response,
      },
    ];
  },
);

export { filledWorkspaceData };
