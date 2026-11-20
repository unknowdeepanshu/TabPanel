import { Button } from "@src/components/ui/button";
import { Field } from "@src/components/ui/field";
import { Input } from "@src/components/ui/input";
import Project from "../project/project";
import { Card } from "@src/components/ui/card";
import { AppSidebar } from "@src/components/app-sidebar";

import { SidebarInset, SidebarProvider } from "@src/components/ui/sidebar";
import Tabs from "../tab/tab";
import { useAppSelector } from "@src/store/hook";
import { useState, useEffect } from "react";
import { browser } from "wxt/browser";

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
  const selectedProject = projects.find((item) => item.id === projectId);
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
          ) : (
            <div className="flex h-full w-full flex-col gap-4">
              <div className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm">
                <h1 className="flex text-3xl">
                  {workspace?.workspaceName ?? "Workspace"}
                </h1>
                <InputInline />
              </div>
              <div className="rounded-xl bg-white/90 p-4 shadow-sm">
                <Project
                  workspaceId={workspaceId}
                  projects={projects}
                  selectedProjectId={projectId}
                  onProjectSelect={(selectedId) => {
                    setProjectId(selectedId);
                    setTabId(undefined);
                  }}
                />
              </div>
              <div className="rounded-xl bg-white/80 p-1 shadow-sm">
                <Tabs
                  ProjectTitle={selectedProject?.name}
                  tabs={selectedProject?.tabs ?? []}
                  selectedTabId={tabId}
                  onTabSelect={setTabId}
                />
              </div>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export function InputInline() {
  return (
    <Field orientation="horizontal">
      <Input type="search" placeholder="Search..." className="ring-1" />
      <Button variant="orange" className="">
        Search
      </Button>
    </Field>
  );
}
