"use client"

import * as React from "react"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { HugeiconsIcon } from "@hugeicons/react"
import { LayoutBottomIcon } from "@hugeicons/core-free-icons"
import {
  SidebarTrigger,
} from "@/components/ui/sidebar"
// This is sample data.

const data = {
  user: {
    name: "Dipanshu",
    email: "Dipanshu@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: (
        <HugeiconsIcon icon={LayoutBottomIcon} strokeWidth={2} />
      ),
      plan: "Enterprise",
    }
  ],
  navMain: [
    {
      title: "Playground",
      url: "#",
      isActive: true,

    }
  ],

}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <>
      <Sidebar className=" text-white-400" collapsible="icon" {...props}>
        <SidebarHeader className="bg-black-100">
          <TeamSwitcher teams={data.teams} />
        </SidebarHeader>
        <SidebarContent className="bg-black-100">
          <NavMain items={data.navMain} />

        </SidebarContent>
        <SidebarFooter className="bg-black-100">
          <NavUser user={data.user} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <div className="h-auto bg-white-400 ml-1 w-3 flex justify-center flex-col items-center">
        <SidebarTrigger />
      </div>
    </>
  )
}
