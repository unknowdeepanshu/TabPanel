import { browser } from "wxt/browser";
export async function openAllTabs(urls: string[]) {
  return await browser.runtime.sendMessage({ type: "OPEN_ALL_TABS", urls });
}
