import { createRoot, type Root } from "react-dom/client";
import { StrictMode } from "react";
import { browser } from "wxt/browser";
import { defineContentScript } from "wxt/utils/define-content-script";
import TabPlanIframe from "@src/components/Iframe/Iframe";
import { Provider } from "react-redux";
import { store } from "@src/store/store";

let tabplanRoot: HTMLDivElement | null = null;
let reactRoot: Root | null = null;

function openTabPlan() {
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

  reactRoot?.unmount();
  tabplanRoot.remove();
  tabplanRoot = null;
  reactRoot = null;
}

export default defineContentScript({
  matches: ["<all_urls>"],
  main() {
    browser.runtime.onMessage.addListener((message) => {
      if (message.type === "KEYBOARD_COMMAND") {
        if (message.command === "toggle-tabplan") {
          openTabPlan();
          window.addEventListener("click", (event) => {
            if ((event.target as HTMLElement | null)?.id === "tabplan-root") {
              closeTabPlan();
            }
          });
        }

        if (message.command === "show-tabplan") {
          openTabPlan();
        }
      }
    });
  },
});
