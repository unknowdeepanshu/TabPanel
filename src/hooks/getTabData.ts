import * as React from "react";

export function useTabdata() {
  const [data, setData] = React.useState();
  React.useEffect(() => {
    if (!chrome?.runtime?.sendMessage) {
      return;
    }
    chrome.runtime.sendMessage({ type: "GET_TAB_DATA" }, (response) => {
      setData(response);
    });
  }, []);
  return data;
}
