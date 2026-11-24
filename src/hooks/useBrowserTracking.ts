import { useAppDispatch } from "@src/store/hook";
import {
  addTab,
  removeTab,
  updateTab,
  addProject,
  removeProject,
} from "@src/store/workspace/workspaceSlice";
import { useEffect } from "react";
import { browser } from "wxt/browser";

export default function useBrowserTrack(workSpaceID?: number) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const handleMessage = (message: any) => {
      switch (message.type) {
        case "TAB_CREATED":
          const tab: any = message.payload;
          return dispatch(addTab({ Tab: tab }));
        case "TAB_REMOVED":
          const tabs = message.payload;
          return dispatch(removeTab(tabs));
        case "TAB_UPDATED":
          const Tab = message.payload;
          return dispatch(updateTab({ Tab }));
        case "WINDOW_CREATED":
          const windowCreated = message.payload;
          // console.log("this is windowCreated", windowCreated);
          if (workSpaceID === undefined) return;
          return dispatch(
            addProject({
              workspaceId: workSpaceID,
              project: {
                id: windowCreated?.id,
                name: "Untitled Project",
                tabNumber: 0,
                tabs: [],
              },
            }),
          );
        case "WINDOW_CLOSED":
          const windowClosed = message.payload;
          // console.log("This is window close", windowClosed);
          if (workSpaceID === undefined) return;
          return dispatch(
            removeProject({
              workspaceId: workSpaceID,
              projectId: windowClosed,
            }),
          );
        default:
          break;
      }
    };

    browser.runtime.onMessage.addListener(handleMessage);

    return () => {
      browser.runtime.onMessage.removeListener(handleMessage);
    };
  }, [dispatch, workSpaceID]);
}
