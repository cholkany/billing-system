'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  Plus,
  Router,
  MoreVertical,
  Settings,
  Trash2,
  Power,
  Activity,
  MapPin,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Empty } from '@/components/ui/empty'
import { useRouter as useRouterContext } from '@/contexts/router-context'

export default function RoutersPage() {
  const { routers, setSelectedRouter } = useRouterContext()

  if (routers.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Empty
          icon={Router}
          title="No routers connected"
          description="Add your first MikroTik router to start managing your network."
        >
          <Button asChild>
            <Link href="/routers/add">
              <Plus className="mr-2 h-4 w-4" />
              Add Router
            </Link>
          </Button>
        </Empty>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Routers</h1>
          <p className="text-muted-foreground">
            Manage your MikroTik routers and network devices
          </p>
        </div>
        <Button asChild>
          <Link href="/routers/add">
            <Plus className="mr-2 h-4 w-4" />
            Add Router
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {routers.map((router) => (
          <Card
            key={router.id}
            className="group relative cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
            onClick={() => setSelectedRouter(router)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      router.status === 'online'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <Router className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{router.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {router.ip}:{router.port}
                    </CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/routers/${router.id}/settings`}>
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Power className="mr-2 h-4 w-4" />
                      Reconnect
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive focus:text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge
                  variant={router.status === 'online' ? 'default' : 'secondary'}
                  className={
                    router.status === 'online'
                      ? 'bg-primary/10 text-primary hover:bg-primary/20'
                      : ''
                  }
                >
                  <span
                    className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                      router.status === 'online' ? 'bg-primary' : 'bg-muted-foreground'
                    }`}
                  />
                  {router.status === 'online' ? 'Online' : 'Offline'}
                </Badge>
                {router.model && (
                  <span className="text-xs text-muted-foreground">
                    {router.model}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                {router.location && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{router.location}</span>
                  </div>
                )}
                {router.uptime && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Activity className="h-3 w-3" />
                    <span className="truncate">{router.uptime}</span>
                  </div>
                )}
              </div>

              <Button
                variant="secondary"
                className="w-full"
                asChild
                onClick={(e) => e.stopPropagation()}
              >
                <Link href={`/dashboard?router=${router.id}`}>
                  Open Dashboard
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
