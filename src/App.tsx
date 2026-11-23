import "./App.css";
import Page from "@src/components/dashboard/Dahboard";
import { useAppDispatch } from "@src/store/hook"
import { filledWorkspaceData } from "@src/store/workspace/thunkapi/workspaceThunk"
import { useEffect } from "react";

function App() {
  const dispatch = useAppDispatch()
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
