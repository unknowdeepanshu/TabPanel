import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "wxt";

export default defineConfig({
  entrypointsDir: "./src/entrypoints",
  alias: {
    "@src": fileURLToPath(new URL("./src", import.meta.url)),
  },
  manifest: {
    name: "TabPlan",
    version: "1.0.0",
    description: "Manage and organize browser tabs by project",
    permissions: ["activeTab", "scripting", "tabs", "tabGroups", "windows"],
    commands: {
      "toggle-tabplan": {
        suggested_key: {
          default: "Alt+L",
        },
        description: "Open or close TabPlan",
      },
    },
    action: {},
  },
  vite: () => ({
    plugins: [tailwindcss(), react()],
  }),
});
