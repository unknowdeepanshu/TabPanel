import { Card } from "@src/components/ui/card";
import { AppSidebar } from "@src/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@src/components/ui/sidebar";
import { useAppSelector } from "@src/store/hook";
import { useState, useEffect } from "react";
import { browser } from "wxt/browser";
import { WorkspacePlanner } from "../workspacePlaner/workspacePlaner";

export function CardDemo() {
  return (
    <>
      <Card className="h-full w-full">
        {/* <IframeMode /> */}
        <Page />
      </Card>
    </>
  );
}

export default function Page() {
  const [workspaceId, setWorkspaceId] = useState<number>();
  const [projectId, setProjectId] = useState<number>();
  const [tabId, setTabId] = useState<number>();
  const workspaceData = useAppSelector((state) => state.workspace);
  const workspace = workspaceData.workspaces.find(
    (item) => item.id === workspaceId,
  );
  const projects = workspace?.projects ?? [];
  console.log("this is workid", workspaceData);
  useEffect(() => {
    browser.runtime
      .sendMessage("session")
      .then((res) => console.log("this is session data", res))
      .catch((error) =>
        console.error("Unable to retrieve session data", error),
      );
  }, []);
  return (
    <SidebarProvider>
      <AppSidebar workspaceId={workspaceId} setWorkspaceId={setWorkspaceId} />
      <SidebarInset className="bg-white p-4 w-3xs">
        <div className="flex flex-1 flex-col gap-4 bg-white p-4 text-black">
          {workspaceId == undefined ? (
            <div className="flex h-full w-auto items-center justify-center">
              <h1 className="text-2xl"> Select workspace</h1>
            </div>
          ) : Number.isNaN(workspaceId) ? (
            <Setting />
          ) : (
            <WorkspacePlanner
              workspaceId={workspaceId}
              workspaceName={workspace?.workspaceName ?? "Workspace"}
              projects={projects}
              selectedProjectId={projectId}
              selectedTabId={tabId}
              onProjectSelect={(selectedId) => {
                setProjectId(selectedId);
                setTabId(undefined);
              }}
              onTabSelect={setTabId}
            />
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export function Setting() {
  return (<>
    <div className="flex h-full w-auto items-center justify-center">
      <h1 className="text-2xl"> there is Setting</h1>
    </div>
  </>)
}