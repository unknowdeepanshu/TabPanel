import {
  Collapsible,
  CollapsibleTrigger,
} from "@src/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@src/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@src/components/ui/dropdown-menu"
import { HugeiconsIcon } from "@hugeicons/react"
import { MoreHorizontalCircle01Icon, Delete02Icon } from "@hugeicons/core-free-icons"
import { IconFolderPlus, IconFolderFilled } from '@tabler/icons-react';
import { cn } from "cn"
import { useState, type Dispatch, type SetStateAction } from "react"
import { addWorkspace, renameWorkspace } from "@src/store/workspace/workspaceSlice"
import { useAppDispatch } from "@src/store/hook"
import { createUniqueId, usedIds } from "@src/utils/creationId"

export function NavMain({
  items,
  activeWorkspaceId,
  onWorkspaceSelect,
}: {
  items: {
    id: number,
    title: string
    icon?: React.ReactNode
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
  activeWorkspaceId?: number
  onWorkspaceSelect: Dispatch<SetStateAction<number | undefined>>
}) {

  const [editingWorkspaceId, setEditingWorkspaceId] = useState<number | null>(null)
  const [value, setValue] = useState("")
  const dispatch = useAppDispatch()
  const { isMobile } = useSidebar()

  const handleAddWorkspace = () => {
    const id = createUniqueId(usedIds)
    dispatch(addWorkspace({
      id,
      workspaceName: "Untitled workspace",
      projects: [],
      res: null,
    }))
    onWorkspaceSelect(id)
    setValue("Untitled workspace")
    setEditingWorkspaceId(id)
  }

  return (
    <SidebarGroup className="dark">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip="Add workspace"
            onClick={handleAddWorkspace}
            className="text-white-400 flex justify-between"
          >
            <span className="group-data-[collapsible=icon]:hidden"> workspace</span>
            <IconFolderPlus />
          </SidebarMenuButton>
        </SidebarMenuItem>
        {items.map((item) => {
          return (
            <Collapsible
              key={item.title}
              defaultOpen={true}
              className="group/collapsible"
              render={<SidebarMenuItem />}
            >
              <CollapsibleTrigger
                className={cn("hover:bg-gray-500/20 mt-1 hover:text-white-400 ")}
                onClick={() => onWorkspaceSelect(item.id)}
                render={<SidebarMenuButton tooltip={item.title} isActive={item.id === activeWorkspaceId} />}
              >
                <IconFolderFilled color="#f97316" />
                {editingWorkspaceId === item.id ? (
                  <input
                    type="text"
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    onBlur={() => {
                      dispatch(renameWorkspace({ id: item.id, workspaceName: value }))
                      setEditingWorkspaceId(null)
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.currentTarget.blur()
                      }
                    }}
                    autoFocus
                  />
                ) : (
                  <span onDoubleClick={() => {
                    setValue(item.title)
                    setEditingWorkspaceId(item.id)
                  }}>{item.title}</span>)
                }
              </CollapsibleTrigger>
              <DropdownMenu  >
                <DropdownMenuTrigger
                  style={{ top: "0.7rem" }}
                  render={
                    <SidebarMenuAction
                      showOnHover
                      className="aria-expanded:bg-muted "
                    />
                  }
                >
                  <HugeiconsIcon icon={MoreHorizontalCircle01Icon} strokeWidth={2} />
                  <span className="sr-only">More</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-fit dark"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive">
                    <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
                    <span>Delete Project</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
