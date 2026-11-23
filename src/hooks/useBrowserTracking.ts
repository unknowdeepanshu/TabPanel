import { useAppDispatch } from "@src/store/hook";
import {
  addTab,
  removeTab,
  updateTab,
} from "@src/store/workspace/workspaceSlice";
import { useEffect } from "react";
import { browser } from "wxt/browser";

export default function useBrowserTrack() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const handleMessage = (message: any) => {
      switch (message.type) {
        case "TAB_CREATED":
          const tab: any = message.payload;
          return dispatch(addTab({ Tab: tab }));
        case "TAB_REMOVED":
          const tabs = message.payload;
          console.log("React received remove tabs:", tabs);
          return dispatch(removeTab(tabs));
        case "TAB_UPDATED":
          const Tab = message.payload;
          console.log("React received update tabs:", Tab);
          return dispatch(updateTab({ Tab }));
        default:
          break;
      }
    };

    browser.runtime.onMessage.addListener(handleMessage);

    return () => {
      browser.runtime.onMessage.removeListener(handleMessage);
    };
  }, [dispatch]);
}
