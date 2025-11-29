"use client"

import * as React from "react"
import { GuildLogo } from "@/components/ui/guild-logo"
import { SidebarNav } from "./SidebarNav"
import { useGuild } from "@/lib/contexts/GuildContext"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"

export function AppSidebar() {
  const { config } = useGuild()
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-2 py-3">
          {isCollapsed ? (
            <div className="flex flex-col items-center justify-center w-full gap-2">
              <SidebarTrigger className="w-8 h-8" />
              <GuildLogo size="sm" />
            </div>
          ) : (
            <>
              <GuildLogo size="sm" className="shrink-0" />
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-sm font-semibold text-sidebar-foreground">
                  {config?.metadata.name || "Guild Manager"}
                </h2>
                <p className="truncate text-xs text-sidebar-foreground/70">
                  {config?.metadata.server || "Server"}
                </p>
              </div>
              <SidebarTrigger className="-mr-1" />
            </>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarNav />
      </SidebarContent>
    </Sidebar>
  )
}
