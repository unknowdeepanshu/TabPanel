import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@src/content.css";
import App from "@src/App";
import { ThemeProvider } from "@src/components/darkmode/theme-provider";
import { Provider } from "react-redux";
import { store } from "@src/store/store";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <App />
      </ThemeProvider>
    </Provider>
  </StrictMode>,
);
