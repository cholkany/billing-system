'use client'

import * as React from 'react'
import { Save, User, Bell, Shield, Palette, Globe } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

export default function SettingsPage() {
  const [profile, setProfile] = React.useState({
    name: 'Admin User',
    email: 'admin@mikrobill.local',
    company: 'MikroBill',
  })

  const [notifications, setNotifications] = React.useState({
    emailAlerts: true,
    routerOffline: true,
    lowVouchers: true,
    weeklyReport: false,
  })

  const [appearance, setAppearance] = React.useState({
    theme: 'dark',
    language: 'en',
    timezone: 'UTC',
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and application preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and company details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FieldGroup>
                <Field>
                  <FieldLabel>Full Name</FieldLabel>
                  <Input
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                  />
                </Field>
                <Field>
                  <FieldLabel>Email Address</FieldLabel>
                  <Input
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                  />
                </Field>
                <Field>
                  <FieldLabel>Company Name</FieldLabel>
                  <Input
                    value={profile.company}
                    onChange={(e) =>
                      setProfile({ ...profile, company: e.target.value })
                    }
                  />
                </Field>
              </FieldGroup>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose what notifications you want to receive.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Alerts</p>
                    <p className="text-sm text-muted-foreground">
                      Receive important alerts via email
                    </p>
                  </div>
                  <Switch
                    checked={notifications.emailAlerts}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, emailAlerts: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Router Offline</p>
                    <p className="text-sm text-muted-foreground">
                      Get notified when a router goes offline
                    </p>
                  </div>
                  <Switch
                    checked={notifications.routerOffline}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, routerOffline: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Low Voucher Stock</p>
                    <p className="text-sm text-muted-foreground">
                      Alert when unused vouchers are running low
                    </p>
                  </div>
                  <Switch
                    checked={notifications.lowVouchers}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, lowVouchers: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Weekly Report</p>
                    <p className="text-sm text-muted-foreground">
                      Receive a weekly summary of your hotspot activity
                    </p>
                  </div>
                  <Switch
                    checked={notifications.weeklyReport}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, weeklyReport: checked })
                    }
                  />
                </div>
              </div>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize the look and feel of the application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FieldGroup>
                <Field>
                  <FieldLabel>Theme</FieldLabel>
                  <Select
                    value={appearance.theme}
                    onValueChange={(v) =>
                      setAppearance({ ...appearance, theme: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel>Language</FieldLabel>
                  <Select
                    value={appearance.language}
                    onValueChange={(v) =>
                      setAppearance({ ...appearance, language: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="id">Indonesian</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel>Timezone</FieldLabel>
                  <Select
                    value={appearance.timezone}
                    onValueChange={(v) =>
                      setAppearance({ ...appearance, timezone: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="Asia/Jakarta">Asia/Jakarta (WIB)</SelectItem>
                      <SelectItem value="America/New_York">America/New York (EST)</SelectItem>
                      <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </FieldGroup>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your password and security preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FieldGroup>
                <Field>
                  <FieldLabel>Current Password</FieldLabel>
                  <Input type="password" placeholder="Enter current password" />
                </Field>
                <Field>
                  <FieldLabel>New Password</FieldLabel>
                  <Input type="password" placeholder="Enter new password" />
                </Field>
                <Field>
                  <FieldLabel>Confirm New Password</FieldLabel>
                  <Input type="password" placeholder="Confirm new password" />
                </Field>
              </FieldGroup>
              <Button>
                <Shield className="mr-2 h-4 w-4" />
                Update Password
              </Button>

              <Separator className="my-6" />

              <div>
                <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Enable 2FA</p>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
              </div>

              <Separator className="my-6" />

              <div>
                <h3 className="text-lg font-medium mb-4">Active Sessions</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Current Session</p>
                        <p className="text-sm text-muted-foreground">
                          Chrome on macOS - Active now
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">Current</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function Badge({ children, variant }: { children: React.ReactNode; variant?: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
      {children}
    </span>
  )
}
