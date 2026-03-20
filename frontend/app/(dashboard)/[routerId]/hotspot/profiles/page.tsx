'use client'
import * as React from 'react'
import {
  Plus,
  Search,
  MoreVertical,
  Pencil,
  Trash2,
  Copy,
  UserCircle,
  Clock,
  Gauge,
  Users,
  DollarSign,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'

interface Profile {
  id: string
  name: string
  speedLimit: string
  sharedUsers: number
  sessionTimeout: string
  price: number
  validity: string
  usersCount: number
}

const mockProfiles: Profile[] = [
  {
    id: '1',
    name: 'Hourly Basic',
    speedLimit: '5M/5M',
    sharedUsers: 1,
    sessionTimeout: '1h',
    price: 10,
    validity: '1 hour',
    usersCount: 45,
  },
  {
    id: '2',
    name: 'Daily Standard',
    speedLimit: '10M/10M',
    sharedUsers: 2,
    sessionTimeout: '24h',
    price: 50,
    validity: '1 day',
    usersCount: 128,
  },
  {
    id: '3',
    name: 'Weekly Premium',
    speedLimit: '20M/20M',
    sharedUsers: 3,
    sessionTimeout: '7d',
    price: 200,
    validity: '7 days',
    usersCount: 89,
  },
  {
    id: '4',
    name: 'Monthly Unlimited',
    speedLimit: '50M/50M',
    sharedUsers: 5,
    sessionTimeout: '30d',
    price: 500,
    validity: '30 days',
    usersCount: 234,
  },
]

export default function ProfilesPage() {
  const [profiles, setProfiles] = React.useState(mockProfiles)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [newProfile, setNewProfile] = React.useState({
    name: '',
    downloadSpeed: '',
    uploadSpeed: '',
    sharedUsers: '1',
    sessionTimeout: '',
    timeUnit: 'hours',
    price: '',
    validity: '',
    validityUnit: 'days',
  })

  const filteredProfiles = profiles.filter((profile) =>
    profile.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateProfile = () => {
    const profile: Profile = {
      id: String(profiles.length + 1),
      name: newProfile.name,
      speedLimit: `${newProfile.downloadSpeed}M/${newProfile.uploadSpeed}M`,
      sharedUsers: parseInt(newProfile.sharedUsers),
      sessionTimeout: `${newProfile.sessionTimeout}${newProfile.timeUnit.charAt(0)}`,
      price: parseFloat(newProfile.price),
      validity: `${newProfile.validity} ${newProfile.validityUnit}`,
      usersCount: 0,
    }
    setProfiles([...profiles, profile])
    setIsCreateOpen(false)
    setNewProfile({
      name: '',
      downloadSpeed: '',
      uploadSpeed: '',
      sharedUsers: '1',
      sessionTimeout: '',
      timeUnit: 'hours',
      price: '',
      validity: '',
      validityUnit: 'days',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Hotspot Profiles</h1>
          <p className="text-muted-foreground">
            Manage speed profiles and pricing plans
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Profile</DialogTitle>
              <DialogDescription>
                Define a new hotspot profile with speed limits and pricing.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <FieldGroup>
                <Field>
                  <FieldLabel>Profile Name</FieldLabel>
                  <Input
                    placeholder="e.g., Daily Standard"
                    value={newProfile.name}
                    onChange={(e) =>
                      setNewProfile({ ...newProfile, name: e.target.value })
                    }
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel>Download Speed</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        type="number"
                        placeholder="10"
                        value={newProfile.downloadSpeed}
                        onChange={(e) =>
                          setNewProfile({ ...newProfile, downloadSpeed: e.target.value })
                        }
                      />
                      <InputGroupAddon>Mbps</InputGroupAddon>
                    </InputGroup>
                  </Field>
                  <Field>
                    <FieldLabel>Upload Speed</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        type="number"
                        placeholder="10"
                        value={newProfile.uploadSpeed}
                        onChange={(e) =>
                          setNewProfile({ ...newProfile, uploadSpeed: e.target.value })
                        }
                      />
                      <InputGroupAddon>Mbps</InputGroupAddon>
                    </InputGroup>
                  </Field>
                </div>
                <Field>
                  <FieldLabel>Shared Users (Concurrent Devices)</FieldLabel>
                  <Select
                    value={newProfile.sharedUsers}
                    onValueChange={(v) =>
                      setNewProfile({ ...newProfile, sharedUsers: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <SelectItem key={n} value={String(n)}>
                          {n} device{n > 1 ? 's' : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel>Session Timeout</FieldLabel>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="24"
                        value={newProfile.sessionTimeout}
                        onChange={(e) =>
                          setNewProfile({ ...newProfile, sessionTimeout: e.target.value })
                        }
                        className="flex-1"
                      />
                      <Select
                        value={newProfile.timeUnit}
                        onValueChange={(v) =>
                          setNewProfile({ ...newProfile, timeUnit: v })
                        }
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hours">Hours</SelectItem>
                          <SelectItem value="days">Days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </Field>
                  <Field>
                    <FieldLabel>Validity Period</FieldLabel>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="1"
                        value={newProfile.validity}
                        onChange={(e) =>
                          setNewProfile({ ...newProfile, validity: e.target.value })
                        }
                        className="flex-1"
                      />
                      <Select
                        value={newProfile.validityUnit}
                        onValueChange={(v) =>
                          setNewProfile({ ...newProfile, validityUnit: v })
                        }
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hours">Hours</SelectItem>
                          <SelectItem value="days">Days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </Field>
                </div>
                <Field>
                  <FieldLabel>Price</FieldLabel>
                  <InputGroup>
                    <InputGroupAddon>$</InputGroupAddon>
                    <InputGroupInput
                      type="number"
                      placeholder="50"
                      value={newProfile.price}
                      onChange={(e) =>
                        setNewProfile({ ...newProfile, price: e.target.value })
                      }
                    />
                  </InputGroup>
                </Field>
              </FieldGroup>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateProfile}>Create Profile</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search profiles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Profiles Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProfiles.map((profile) => (
          <Card key={profile.id} className="group">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <UserCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{profile.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {profile.usersCount} active users
                    </CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive focus:text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <Gauge className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.speedLimit}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.sharedUsers} device{profile.sharedUsers > 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.validity}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>${profile.price}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
