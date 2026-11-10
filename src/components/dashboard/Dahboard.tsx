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
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset  >
        <div className="flex bg-white-400 flex-1 text-black flex-col gap-4 p-4">
          <div className="h-full w-full flex flex-col">
            <div className="flex flex-col gap-3 mb-4">
              <h1 className="text-3xl flex">Workspace</h1 >
              <InputInline />
            </div>
            <Project />
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
