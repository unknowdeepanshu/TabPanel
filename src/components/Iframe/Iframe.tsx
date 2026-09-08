import { CardDemo } from "@/components/dashboard/Dahboard";
import { StrictMode, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import cssText from "../../index.css?inline";
import { useAppSelector } from "@/store/hook";
import { Provider } from "react-redux";
import { store } from "@/store/store";

export default function TabPlanIframe() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const { theme } = useAppSelector((state) => state.mode);
  useEffect(() => {
    const iframe = iframeRef.current;

    if (!iframe) return;
    const documentElement = iframe.contentDocument?.documentElement;
    if (!documentElement) return;

    if (theme === "light") {
      documentElement.classList.remove("light", "dark");
      documentElement.classList.add(theme);
      return;
    }
    if (theme === "dark") {
      documentElement.classList.remove("light", "dark");
      documentElement.classList.add(theme);
      return;
    }
    if (theme === "system") {
      const systemTheme =
        window.matchMedia("(prefers-color-scheme: dark)").matches ?
          "dark"
        : "light";

      documentElement.classList.remove("light", "dark");
      documentElement.classList.add(systemTheme);
      return;
    }
  }, [theme]);
  useEffect(() => {
    const iframe = iframeRef.current;

    if (!iframe) return;

    iframe.srcdoc = `
<!doctype html>
 <html lang="en" >
     
  <head>
    <meta charset="UTF-8" />

    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />

    <title>tab-managements</title>

    </head>
    
    <style>
    ${cssText}
    </style>
    <body>
    <div id="root"></div>
  </body>
</html>
`;

    const handlLoad = () => {
      const root = iframe.contentDocument?.getElementById("root");
      if (!root) {
        throw new Error("Root element not found");
      }
      Object.assign(root.style, {
        height: "100%",
      });

      createRoot(root).render(
        <StrictMode>
          <Provider store={store}>
            <CardDemo />
          </Provider>
        </StrictMode>,
      );
    };
    iframe.addEventListener("load", handlLoad);

    return () => iframe.removeEventListener("load", handlLoad);
  }, []);
  return (
    <>
      <iframe
        ref={iframeRef}
        id="tabplan-iframe"
        title="TabPlan"
        style={{
          width: "50%",
          height: "60%",
          border: "none",
          borderRadius: "10px",
          background: "transparent",
        }}
      />
    </>
  );
}
