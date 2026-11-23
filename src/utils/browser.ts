import { useAppDispatch } from "@src/store/hook";
import { addProject } from "@src/store/workspace/workspaceSlice";
import { browser } from "wxt/browser";

export async function openAllTabs({
  workspaceId,
  urls,
  windowsId,
}: {
  workspaceId?: number;
  urls: string[];
  windowsId: number;
}) {
  const dispatch = useAppDispatch();
  const data = await browser.runtime.sendMessage({
    type: "OPEN_ALL_TABS",
    urls,
  });
  await browser.runtime.sendMessage({
    type: "CLOSE_ALL_TABS",
    windowsId,
  });
  dispatch(
    addProject({
      workspaceId: workspaceId!,
      project: {
        id: data.windowId,
        name: "Untitled Project",
        tabNumber: data.tabs.length,
        tabs: data.tabs,
      },
    }),
  );
}
