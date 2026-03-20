'use client'
import * as React from 'react'
import {
  Network,
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  Wifi,
  Globe,
  Server,
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

interface NetworkItem {
  id: string
  name: string
  type: 'lan' | 'wan' | 'hotspot'
  interface: string
  subnet: string
  gateway: string
  status: 'active' | 'inactive'
  clients: number
}

const mockNetworks: NetworkItem[] = [
  {
    id: '1',
    name: 'Main LAN',
    type: 'lan',
    interface: 'ether1',
    subnet: '192.168.1.0/24',
    gateway: '192.168.1.1',
    status: 'active',
    clients: 24,
  },
  {
    id: '2',
    name: 'Guest Hotspot',
    type: 'hotspot',
    interface: 'wlan1',
    subnet: '10.10.10.0/24',
    gateway: '10.10.10.1',
    status: 'active',
    clients: 142,
  },
  {
    id: '3',
    name: 'WAN Connection',
    type: 'wan',
    interface: 'ether2',
    subnet: 'DHCP',
    gateway: 'Auto',
    status: 'active',
    clients: 0,
  },
  {
    id: '4',
    name: 'Staff Network',
    type: 'lan',
    interface: 'ether3',
    subnet: '192.168.10.0/24',
    gateway: '192.168.10.1',
    status: 'inactive',
    clients: 0,
  },
]

export default function NetworksPage() {
  const [networks, setNetworks] = React.useState(mockNetworks)
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)

  const getTypeIcon = (type: NetworkItem['type']) => {
    switch (type) {
      case 'lan':
        return <Server className="h-5 w-5" />
      case 'wan':
        return <Globe className="h-5 w-5" />
      case 'hotspot':
        return <Wifi className="h-5 w-5" />
    }
  }

  const getTypeBadge = (type: NetworkItem['type']) => {
    switch (type) {
      case 'lan':
        return <Badge variant="secondary">LAN</Badge>
      case 'wan':
        return <Badge variant="outline">WAN</Badge>
      case 'hotspot':
        return (
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
            Hotspot
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Networks</h1>
          <p className="text-muted-foreground">
            Manage network interfaces and configurations
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Network
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Network</DialogTitle>
              <DialogDescription>
                Configure a new network interface.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <FieldGroup>
                <Field>
                  <FieldLabel>Network Name</FieldLabel>
                  <Input placeholder="e.g., Guest Network" />
                </Field>
                <Field>
                  <FieldLabel>Type</FieldLabel>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lan">LAN</SelectItem>
                      <SelectItem value="wan">WAN</SelectItem>
                      <SelectItem value="hotspot">Hotspot</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel>Interface</FieldLabel>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select interface" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ether1">ether1</SelectItem>
                      <SelectItem value="ether2">ether2</SelectItem>
                      <SelectItem value="ether3">ether3</SelectItem>
                      <SelectItem value="wlan1">wlan1</SelectItem>
                      <SelectItem value="wlan2">wlan2</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel>Subnet</FieldLabel>
                  <Input placeholder="e.g., 192.168.1.0/24" />
                </Field>
                <Field>
                  <FieldLabel>Gateway</FieldLabel>
                  <Input placeholder="e.g., 192.168.1.1" />
                </Field>
              </FieldGroup>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsCreateOpen(false)}>Add Network</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Networks Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {networks.map((network) => (
          <Card key={network.id} className="group">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      network.status === 'active'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {getTypeIcon(network.type)}
                  </div>
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      {network.name}
                      {getTypeBadge(network.type)}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Interface: {network.interface}
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
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Subnet</p>
                  <p className="font-mono">{network.subnet}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Gateway</p>
                  <p className="font-mono">{network.gateway}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      network.status === 'active' ? 'bg-primary' : 'bg-muted-foreground'
                    }`}
                  />
                  <span className="text-sm capitalize">{network.status}</span>
                </div>
                {network.clients > 0 && (
                  <span className="text-sm text-muted-foreground">
                    {network.clients} connected
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
