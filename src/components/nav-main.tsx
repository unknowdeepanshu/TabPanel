import {
  Collapsible,
  CollapsibleTrigger,
} from "@src/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
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
import { renameWorkspace } from "@src/store/workspace/workspaceSlice"
import { useAppDispatch } from "@src/store/hook"

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
  return (
    <SidebarGroup className="dark">
      <SidebarGroupLabel className="flex justify-between">
        <h1 className=" text-white-400">
          workspace
        </h1>
        <SidebarMenuButton className="w-auto" >
          <IconFolderPlus />
        </SidebarMenuButton>
      </SidebarGroupLabel>
      <SidebarMenu >
        {items.map((item) => {
          return (
            <Collapsible
              key={item.title}
              defaultOpen={true}
              className="group/collapsible"
              render={<SidebarMenuItem />}
            >
              <CollapsibleTrigger
                className={cn(item.id === activeWorkspaceId && "bg-gray-500/20", "hover:bg-gray-500/20 hover:text-white-400 ")}
                onClick={() => onWorkspaceSelect(item.id)}
                render={<SidebarMenuButton tooltip={item.title} />}
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
