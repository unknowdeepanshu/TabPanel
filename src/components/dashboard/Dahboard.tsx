import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Project from "../project/project";
import { Card } from "@/components/ui/card";
import { AppSidebar } from "@/components/app-sidebar"

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import Tabs from "../tab/tab";
import { useAppSelector } from "@/store/hook";
import { useState } from "react";

export function CardDemo() {
  return (
    <>
      <Card className="w-full h-full">
        {/* <IframeMode /> */}
        <Page />
      </Card>
    </>
  );
}


export default function Page() {
  const [workspaceId, setWorkspaceId] = useState<number>()
  const [projectId, setProjectId] = useState<number>()
  const [tabId, setTabId] = useState<number>()
  const worksapceData = useAppSelector((state) => state.workspace)
  const workspace = worksapceData.workspaces.find((item) => item.id === workspaceId)
  const projects = workspace?.projects ?? []
  const selectedProject = projects.find((item) => item.id === projectId)

  return (
    <SidebarProvider>
      <AppSidebar workspaceId={workspaceId} setWorkspaceId={setWorkspaceId} />
      <SidebarInset className="bg-white/70">
        <div className="flex flex-1 flex-col gap-4 bg-white/60 p-4 text-black">
          <div className="flex h-full w-full flex-col gap-4">
            <div className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm">
              <h1 className="text-3xl flex">Workspace</h1 >
              <InputInline />
            </div>
            <div className="rounded-xl bg-white/90 p-4 shadow-sm">
              <Project
                projects={projects}
                selectedProjectId={projectId}
                onProjectSelect={(selectedId) => {
                  setProjectId(selectedId)
                  setTabId(undefined)
                }}
              />
            </div>
            <div className="rounded-xl bg-white/80 p-1 shadow-sm">
              <Tabs
                tabs={selectedProject?.tabs ?? []}
                selectedTabId={tabId}
                onTabSelect={setTabId}
              />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export function InputInline() {
  return (
    <Field orientation="horizontal">
      <Input type="search" placeholder="Search..." />
      <Button variant="orange" className="">Search</Button>
    </Field>
  )
}
