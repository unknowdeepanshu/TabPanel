import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./content.css";
import App from "./App.tsx";
import { ThemeProvider } from "@/components/darkmode/theme-provider.tsx";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <App />
    </ThemeProvider>
  </StrictMode>,
);
