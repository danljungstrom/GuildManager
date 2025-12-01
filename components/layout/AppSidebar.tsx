"use client"

import * as React from "react"
import Link from "next/link"
import { Settings } from "lucide-react"
import { GuildLogo } from "@/components/ui/guild-logo"
import { SidebarNav } from "./SidebarNav"
import { AdminLoginDialog } from "./AdminLoginDialog"
import { ThemeToggle } from "@/components/theme-toggle"
import { useGuild } from "@/lib/contexts/GuildContext"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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
      <SidebarHeader className="relative overflow-hidden border-b border-sidebar-border bg-gradient-to-b from-primary/5 via-primary/[0.02] to-transparent">
        <div className="flex items-center gap-3 px-2 py-4">
          {isCollapsed ? (
            <div className="flex flex-col items-center justify-center w-full gap-2">
              <SidebarTrigger className="w-8 h-8" />
              <div className="[&_img]:brightness-110 [&_img]:contrast-110">
                <GuildLogo size="sm" />
              </div>
            </div>
          ) : (
            <>
              <div className="shrink-0 [&_img]:brightness-110 [&_img]:contrast-110">
                <GuildLogo size="sm" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="truncate text-lg font-semibold text-primary">
                  {config?.metadata.name || "Guild Manager"}
                </h1>
              </div>
              <SidebarTrigger className="-mr-1" />
            </>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarNav />
      </SidebarContent>

      <SidebarFooter className="relative overflow-hidden border-t border-sidebar-border bg-gradient-to-t from-primary/5 via-primary/[0.02] to-transparent">
        {isCollapsed ? (
          // Collapsed state - stack icons vertically
          <div className="flex flex-col items-center gap-2 py-3">
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              title="Settings"
            >
              <Link href="/admin/settings">
                <Settings className="h-4 w-4" />
              </Link>
            </Button>
            <AdminLoginDialog />
            <ThemeToggle collapsed />
          </div>
        ) : (
          // Expanded state - horizontal layout
          <div className="flex items-center justify-between gap-2 px-2 py-3">
            <div className="flex items-center gap-2">
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                title="Settings"
              >
                <Link href="/admin/settings">
                  <Settings className="h-4 w-4" />
                </Link>
              </Button>
              <AdminLoginDialog />
            </div>
            <ThemeToggle />
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
