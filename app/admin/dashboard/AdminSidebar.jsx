'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Shield, Users, LayoutGrid } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'

const navItems = [
  { href: '/admin/dashboard', label: 'User Management', icon: Users },
  { href: '/admin/dashboard/categories', label: 'Categories Management', icon: LayoutGrid },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { isMobile, setOpenMobile } = useSidebar()

  function handleNavClick() {
    if (isMobile) setOpenMobile(false)
  }

  return (
    <Sidebar collapsible="icon" className="!top-16 !h-[calc(100svh-4rem)]">
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="pointer-events-none select-none">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Shield className="h-4 w-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold text-sidebar-foreground">Admin Panel</span>
                <span className="text-xs text-sidebar-foreground/60">ShopNest</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map(({ href, label, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === href || pathname.startsWith(href + '?')}
                    tooltip={label}
                  >
                    <Link href={href} onClick={handleNavClick}>
                      <Icon />
                      <span>{label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  )
}
