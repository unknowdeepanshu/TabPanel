import { useAppDispatch } from "@src/store/hook";
import { updateProject } from "@src/store/workspace/workspaceSlice";
import { browser } from "wxt/browser";

export function useOpenAllTabs() {
  const dispatch = useAppDispatch();

  async function openAllTabs({
    workspaceId,
    urls,
    windowsId,
    projectId,
  }: {
    workspaceId?: number;
    urls: string[];
    windowsId: number;
    projectId: number;
  }) {
    const data = await browser.runtime.sendMessage({
      type: "OPEN_ALL_TABS",
      urls,
    });
    await browser.runtime.sendMessage({
      type: "CLOSE_ALL_TABS",
      windowsId,
    });
    dispatch(
      updateProject({
        projectId: projectId,
        workspaceId: workspaceId!,
        project: {
          id: data.windowId,
          // name: "Untitled Project",
          tabNumber: data.tabs.length,
          tabs: data.tabs,
        },
      }),
    );
  }

  async function closeAllTabs(windowsId: number) {
    await browser.runtime.sendMessage({
      type: "CLOSE_ALL_TABS",
      windowsId,
    });
  }
  return { openAllTabs, closeAllTabs };
}
