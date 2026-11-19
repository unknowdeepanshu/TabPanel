import * as React from "react"
import { NavMain } from "@src/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@src/components/ui/sidebar"
import { useAppSelector } from "@src/store/hook"
import type { Dispatch, SetStateAction } from "react"


// This is sample data.


interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  workspaceId?: number
  setWorkspaceId: Dispatch<SetStateAction<number | undefined>>
}

export function AppSidebar({
  workspaceId,
  setWorkspaceId,
  ...props
}: AppSidebarProps) {

  const datas = useAppSelector((state) => state.workspace)
  const workspacesName = datas?.workspaces.map((workspaceState) => {
    return {
      id: workspaceState?.id,
      title: workspaceState?.workspaceName,
      res: workspaceState.res
    }
  })
  console.log("sdyfsd", workspacesName)
  return (
    <>
      <Sidebar className=" text-white-400" collapsible="icon" {...props}>
        <SidebarHeader className="bg-black-100">
        </SidebarHeader>
        <SidebarContent className="bg-black-100">
          <NavMain
            items={workspacesName}
            activeWorkspaceId={workspaceId}
            onWorkspaceSelect={setWorkspaceId}
          />
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    </>
  )
}

function VerticalLinesvg() {
  return (<>
    <svg xmlns="http://www.w3.org/2000/svg" style={{ height: "3rem", width: "3rem" }} width="4rem" height="10rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" widths="3rem"><path d="M12 5v14"></path></svg>
  </>);
}

export default VerticalLinesvg;