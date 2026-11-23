import "./App.css";
import Page from "@src/components/dashboard/Dahboard";
import { useAppDispatch } from "@src/store/hook"
import { filledWorkspaceData } from "@src/store/workspace/thunkapi/workspaceThunk"
import { useEffect } from "react";
import useBrowserTracking from "@src/hooks/useBrowserTracking";

function App() {
  const dispatch = useAppDispatch()
  useBrowserTracking();

  useEffect(() => {
    void dispatch(filledWorkspaceData())
  }, [dispatch])
  return (
    <>
      <Page />
    </>
  );
}

export default App;
