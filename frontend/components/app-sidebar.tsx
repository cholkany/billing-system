'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Router,
  Wifi,
  Users,
  Ticket,
  BarChart3,
  Settings,
  ChevronDown,
  Network,
  UserCircle,
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Router {
  id: string
  name: string
  ip: string
  status: 'online' | 'offline'
}

// Mock routers - in real app this would come from context/state
const mockRouters: Router[] = [
  { id: '1', name: 'Office Router', ip: '192.168.88.1', status: 'online' },
  { id: '2', name: 'Branch Router', ip: '10.0.0.1', status: 'offline' },
]

function withRouterPrefix(routerId: string | undefined, path: string) {
  if (!routerId) return path
  if (path === '/') return `/${routerId}`
  return `/${routerId}${path.startsWith('/') ? '' : '/'}${path}`
}

interface AppSidebarProps {
  selectedRouter?: Router | null
  onRouterChange?: (router: Router) => void
}

export function AppSidebar({ selectedRouter, onRouterChange }: AppSidebarProps) {
  const pathname = usePathname()
  const [isHotspotOpen, setIsHotspotOpen] = React.useState(
    pathname.startsWith('/hotspot')
  )

  const isRouterSelected = !!selectedRouter
  const routerId = selectedRouter?.id

  const mainNavItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      href: withRouterPrefix(routerId, '/'),
    },
    {
      title: 'Routers',
      icon: Router,
      href: '/routers',
    },
  ]

  const hotspotNavItems = [
    {
      title: 'Profiles',
      icon: UserCircle,
      href: withRouterPrefix(routerId, '/hotspot/profiles'),
    },
    {
      title: 'Users',
      icon: Users,
      href: withRouterPrefix(routerId, '/hotspot/users'),
    },
    {
      title: 'Vouchers',
      icon: Ticket,
      href: withRouterPrefix(routerId, '/hotspot/vouchers'),
    },
    {
      title: 'Statistics',
      icon: BarChart3,
      href: withRouterPrefix(routerId, '/hotspot/stats'),
    },
  ]

  const systemNavItems = [
    {
      title: 'Networks',
      icon: Network,
      href: withRouterPrefix(routerId, '/networks'),
    },
    {
      title: 'Settings',
      icon: Settings,
      href: withRouterPrefix(routerId, '/settings'),
    },
  ]

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Wifi className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-sidebar-foreground">MikroBill</span>
            <span className="text-xs text-muted-foreground">Router Management</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Router Selector */}
        {mockRouters.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Active Router</SidebarGroupLabel>
            <SidebarGroupContent>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex w-full items-center justify-between rounded-md border border-sidebar-border bg-sidebar px-3 py-2 text-sm hover:bg-sidebar-accent">
                    {selectedRouter ? (
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            selectedRouter.status === 'online'
                              ? 'bg-primary'
                              : 'bg-destructive'
                          }`}
                        />
                        <span className="truncate">{selectedRouter.name}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Select router...</span>
                    )}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  {mockRouters.map((router) => (
                    <DropdownMenuItem
                      key={router.id}
                      onClick={() => onRouterChange?.(router)}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            router.status === 'online'
                              ? 'bg-primary'
                              : 'bg-destructive'
                          }`}
                        />
                        <div className="flex flex-col">
                          <span>{router.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {router.ip}
                          </span>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            <Collapsible open={isHotspotOpen} onOpenChange={setIsHotspotOpen}>
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger className="flex w-full items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Wifi className="h-4 w-4" />
                    Hotspot
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      isHotspotOpen ? 'rotate-180' : ''
                    }`}
                  />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {hotspotNavItems.map((item) => (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          asChild
                          isActive={pathname === item.href}
                        >
                          <Link href={item.href}>
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                  <SidebarMenu>
                  {systemNavItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={pathname === item.href}>
                        <Link href={item.href}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Admin User</span>
            <span className="text-xs text-muted-foreground">admin@mikrobill.local</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
