"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Users, Sword, Info, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

export interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  children?: NavItem[]
}

export const navigationItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    label: "Roster",
    href: "/roster",
    icon: Users,
    children: [
      {
        label: "Professions",
        href: "/roster/professions",
        icon: Users,
      },
    ],
  },
  {
    label: "Raids",
    href: "/raids",
    icon: Sword,
  },
  {
    label: "Guild Info",
    href: "/guild-info",
    icon: Info,
  },
]

export function SidebarNav() {
  const pathname = usePathname()
  const { setOpenMobile, isMobile } = useSidebar()

  const isActive = (href: string, isChild = false) => {
    // For child items (roster subitems), use exact match
    if (isChild) {
      return pathname === href
    }
    // For dashboard (home), use exact match
    if (href === "/") {
      return pathname === href
    }
    // For parent items with children, only match if on the exact path
    // This prevents /roster from being active when on /roster/by-class
    return pathname === href || pathname.startsWith(href + "/")
  }

  const handleNavigate = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  const renderNavItems = (items: NavItem[]) => {
    return items.map((item) => {
      const Icon = item.icon
      const active = isActive(item.href)
      const hasChildren = item.children && item.children.length > 0

      // Check if any child is active for default open state
      const hasActiveChild = hasChildren && item.children!.some((child) =>
        isActive(child.href, true)
      )

      return hasChildren ? (
        <Collapsible
          key={item.href}
          asChild
          defaultOpen={hasActiveChild}
          className="group/collapsible"
        >
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton
                tooltip={item.label}
                isActive={active}
                className={cn(
                  "transition-all duration-200",
                  active && "bg-primary/10 text-white font-semibold hover:bg-primary/15 hover:text-white border-l-2 border-primary"
                )}
              >
                <Icon className={cn("h-4 w-4 transition-colors", active && "text-white")} />
                <span>{item.label}</span>
                <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {item.children?.map((child) => {
                  const ChildIcon = child.icon
                  const childActive = isActive(child.href, true)

                  return (
                    <SidebarMenuSubItem key={child.href}>
                      <SidebarMenuSubButton
                        asChild
                        isActive={childActive}
                        className={cn(
                          "transition-all duration-200",
                          childActive && "bg-primary/10 text-white font-semibold hover:bg-primary/15 hover:text-white border-l-2 border-primary"
                        )}
                      >
                        <Link href={child.href} onClick={handleNavigate}>
                          <ChildIcon className={cn("h-4 w-4 transition-colors", childActive && "text-white")} />
                          <span>{child.label}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )
                })}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      ) : (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            tooltip={item.label}
            isActive={active}
            className={cn(
              "transition-all duration-200",
              active && "bg-primary/10 text-white font-semibold hover:bg-primary/15 hover:text-white border-l-2 border-primary"
            )}
          >
            <Link href={item.href} onClick={handleNavigate}>
              <Icon className={cn("h-4 w-4 transition-colors", active && "text-white")} />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )
    })
  }

  return (
    <>
      {/* Main Navigation */}
      <SidebarGroup>
        <SidebarGroupLabel className="text-primary">Navigation</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {renderNavItems(navigationItems)}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  )
}
