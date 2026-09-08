import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import TabPlanIframe from "@/components/Iframe/Iframe";
import { Provider } from "react-redux";
import { store } from "./store/store";

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "KEYBOARD_COMMAND") {
    console.log("Command received:", message.command);

    if (message.command === "toggle-tabplan") {
      openTabPlan();
      window.addEventListener("keyup", (event) => {
        if (event.key === "AltLeft" || event.code === "KeyL") {
          closeTabPlan();
        }
      });
    }

    if (message.command === "show-tabplan") {
      openTabPlan();
    }

    if (message.command === "date") {
      console.log(new Date().toDateString());
    }
  }
});

let tabplanRoot: HTMLDivElement | null = null;
let reactRoot: ReturnType<typeof createRoot> | null = null;

function openTabPlan() {
  // Prevent duplicate UI
  if (tabplanRoot) return;
  closeTabPlan();
  const container = document.createElement("div");

  container.id = "tabplan-root";

  Object.assign(container.style, {
    position: "fixed",
    inset: "0",
    zIndex: "2147483647",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  });

  document.body.appendChild(container);

  tabplanRoot = container;

  reactRoot = createRoot(container);

  reactRoot.render(
    <StrictMode>
      <Provider store={store}>
        <TabPlanIframe />
      </Provider>
    </StrictMode>,
  );
}
function closeTabPlan() {
  if (!tabplanRoot) return;

  // Properly unmount React first
  reactRoot?.unmount();

  // Remove the entire container and iframe
  tabplanRoot.remove();

  // Reset references
  tabplanRoot = null;
  reactRoot = null;
}
