import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./content.css";
import App from "./App.tsx";
import { ThemeProvider } from "@/components/darkmode/theme-provider.tsx";
import { Provider } from "react-redux";
import { store } from "@/store/store";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <App />
      </ThemeProvider>
    </Provider>
  </StrictMode>,
);
