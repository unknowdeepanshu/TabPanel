import "./App.css";
import Page from "@/components/dashboard/Dahboard";
import { useAppDispatch } from "@/store/hook"
import { filledWorkspaceData } from "@/store/workspace/thunkapi/workspaceThunk"
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
