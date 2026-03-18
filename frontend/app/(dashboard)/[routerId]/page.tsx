'use client'

import * as React from 'react'
import {
  Users,
  Ticket,
  Activity,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Wifi,
  TrendingUp,
  UserPlus,
  LogIn,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import Link from 'next/link'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Area, AreaChart, Bar, BarChart, XAxis, YAxis } from 'recharts'
import { routers } from '@/store/data'
import { useParams } from 'next/navigation'

// Mock data
const trafficData = [
  { time: '00:00', download: 120, upload: 45 },
  { time: '04:00', download: 85, upload: 32 },
  { time: '08:00', download: 250, upload: 120 },
  { time: '12:00', download: 380, upload: 180 },
  { time: '16:00', download: 420, upload: 210 },
  { time: '20:00', download: 350, upload: 160 },
  { time: '23:59', download: 180, upload: 75 },
]

const userActivityData = [
  { day: 'Mon', logins: 45 },
  { day: 'Tue', logins: 52 },
  { day: 'Wed', logins: 49 },
  { day: 'Thu', logins: 63 },
  { day: 'Fri', logins: 58 },
  { day: 'Sat', logins: 72 },
  { day: 'Sun', logins: 68 },
]

const recentActivity = [
  { id: 1, type: 'login', user: 'John Doe', time: '2 mins ago', icon: LogIn },
  { id: 2, type: 'voucher', user: 'DAILY-001', time: '5 mins ago', icon: Ticket },
  { id: 3, type: 'new_user', user: 'Jane Smith', time: '12 mins ago', icon: UserPlus },
  { id: 4, type: 'expired', user: 'Mike Wilson', time: '15 mins ago', icon: AlertCircle },
  { id: 5, type: 'login', user: 'Sarah Brown', time: '20 mins ago', icon: LogIn },
  { id: 6, type: 'voucher', user: 'HOURLY-042', time: '25 mins ago', icon: Ticket },
]

const trafficChartConfig = {
  download: {
    label: 'Download',
    color: 'var(--chart-1)',
  },
  upload: {
    label: 'Upload',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig

const activityChartConfig = {
  logins: {
    label: 'User Logins',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig

export default function DashboardPage({ params }: { params: { routerId: string } }) {
  const { routerId } = useParams()

  const selectedRouter = routers.find(router => router.id === routerId)


  if (!selectedRouter) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[60vh]">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Wifi />
            </EmptyMedia>
            <EmptyTitle>No router selected</EmptyTitle>
            <EmptyDescription>
              Select a router from the sidebar to view its dashboard.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link href="/routers">View Routers</Link>
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview for {selectedRouter.name}
          </p>
        </div>
        <Button variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-primary flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3" />
                +12% from yesterday
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,284</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-primary flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3" />
                +48 this week
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Vouchers</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">356</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-destructive flex items-center gap-1">
                <ArrowDownRight className="h-3 w-3" />
                24 expiring today
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Router Uptime</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{selectedRouter.uptime || '0d 0h'}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-primary flex items-center gap-1">
                <Activity className="h-3 w-3" />
                {selectedRouter.status === 'online' ? 'Running smoothly' : 'Offline'}
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* Traffic Chart */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Bandwidth Usage</CardTitle>
            <CardDescription>Network traffic over the last 24 hours (Mbps)</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={trafficChartConfig} className="h-[300px] w-full">
              <AreaChart data={trafficData}>
                <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="download"
                  stroke="var(--color-download)"
                  fill="var(--color-download)"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="upload"
                  stroke="var(--color-upload)"
                  fill="var(--color-upload)"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* User Activity Chart */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>User Logins</CardTitle>
            <CardDescription>Daily login activity this week</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={activityChartConfig} className="h-[300px] w-full">
              <BarChart data={userActivityData}>
                <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="logins" fill="var(--color-logins)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest events from your hotspot</CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              View all
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between border-b border-border/50 pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      activity.type === 'expired'
                        ? 'bg-destructive/10 text-destructive'
                        : 'bg-primary/10 text-primary'
                    }`}
                  >
                    <activity.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{activity.user}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {activity.type.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
