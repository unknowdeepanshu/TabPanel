import {
  Collapsible,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { IconFolderPlus, IconFolderFilled } from '@tabler/icons-react';

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: React.ReactNode
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
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
            defaultOpen={item.isActive}
            className="group/collapsible"
            render={<SidebarMenuItem />}
          >
            <CollapsibleTrigger
              render={<SidebarMenuButton tooltip={item.title} />}
            >
              <IconFolderFilled color="#f97316" />
              <span>{item.title}</span>
            </CollapsibleTrigger>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
