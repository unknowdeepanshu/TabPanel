
import {
  Collapsible,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { HugeiconsIcon } from "@hugeicons/react"
import { MoreHorizontalCircle01Icon, FolderIcon, Delete02Icon } from "@hugeicons/core-free-icons"
import { IconFolderPlus, IconFolderFilled } from '@tabler/icons-react';
import { cn } from "cn"
import type { Dispatch, SetStateAction } from "react"

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

  const { isMobile } = useSidebar()
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="flex justify-between">
        workspace
        <SidebarMenuButton className="w-auto" >
          <IconFolderPlus />
        </SidebarMenuButton>
      </SidebarGroupLabel>

      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            defaultOpen={true}
            className="group/collapsible"
            render={<SidebarMenuItem />}
          >
            <CollapsibleTrigger
              className={cn(item.id === activeWorkspaceId && "bg-muted")}
              onClick={() => onWorkspaceSelect(item.id)}
              render={<SidebarMenuButton tooltip={item.title} />}
            >
              <IconFolderFilled color="#f97316" />
              <span>{item.title}</span>

            </CollapsibleTrigger>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuAction
                    showOnHover
                    className="aria-expanded:bg-muted"
                  />
                }
              >
                <HugeiconsIcon icon={MoreHorizontalCircle01Icon} strokeWidth={2} />
                <span className="sr-only">More</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-fit"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem>
                  <HugeiconsIcon icon={FolderIcon} strokeWidth={2} />
                  <span>Change name</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
                  <span>Delete Project</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Collapsible>

        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
