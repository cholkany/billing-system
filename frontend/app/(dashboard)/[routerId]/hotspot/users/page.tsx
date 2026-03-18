import * as React from 'react'
import {
  Plus,
  Search,
  MoreVertical,
  Pencil,
  Trash2,
  Ban,
  RefreshCw,
  Download,
  Filter,
  Users,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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

interface HotspotUser {
  id: string
  username: string
  profile: string
  macAddress: string
  status: 'active' | 'suspended' | 'expired'
  dataUsage: string
  lastSeen: string
  createdAt: string
}

const mockUsers: HotspotUser[] = [
  {
    id: '1',
    username: 'john.doe',
    profile: 'Daily Standard',
    macAddress: 'AA:BB:CC:DD:EE:F1',
    status: 'active',
    dataUsage: '2.4 GB',
    lastSeen: 'Online now',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    username: 'jane.smith',
    profile: 'Weekly Premium',
    macAddress: 'AA:BB:CC:DD:EE:F2',
    status: 'active',
    dataUsage: '8.7 GB',
    lastSeen: '5 mins ago',
    createdAt: '2024-01-12',
  },
  {
    id: '3',
    username: 'mike.wilson',
    profile: 'Hourly Basic',
    macAddress: 'AA:BB:CC:DD:EE:F3',
    status: 'expired',
    dataUsage: '512 MB',
    lastSeen: '2 hours ago',
    createdAt: '2024-01-20',
  },
  {
    id: '4',
    username: 'sarah.brown',
    profile: 'Monthly Unlimited',
    macAddress: 'AA:BB:CC:DD:EE:F4',
    status: 'active',
    dataUsage: '45.2 GB',
    lastSeen: 'Online now',
    createdAt: '2024-01-01',
  },
  {
    id: '5',
    username: 'tom.johnson',
    profile: 'Daily Standard',
    macAddress: 'AA:BB:CC:DD:EE:F5',
    status: 'suspended',
    dataUsage: '1.1 GB',
    lastSeen: '1 day ago',
    createdAt: '2024-01-18',
  },
]

const profiles = ['Hourly Basic', 'Daily Standard', 'Weekly Premium', 'Monthly Unlimited']

export default function UsersPage() {
  const [users, setUsers] = React.useState(mockUsers)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<string>('all')
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [newUser, setNewUser] = React.useState({
    username: '',
    password: '',
    profile: '',
    macAddress: '',
  })

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.macAddress.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: HotspotUser['status']) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
            Active
          </Badge>
        )
      case 'suspended':
        return (
          <Badge variant="secondary">Suspended</Badge>
        )
      case 'expired':
        return (
          <Badge variant="destructive">Expired</Badge>
        )
    }
  }

  const handleCreateUser = () => {
    const user: HotspotUser = {
      id: String(users.length + 1),
      username: newUser.username,
      profile: newUser.profile,
      macAddress: newUser.macAddress || 'Not bound',
      status: 'active',
      dataUsage: '0 B',
      lastSeen: 'Never',
      createdAt: new Date().toISOString().split('T')[0],
    }
    setUsers([user, ...users])
    setIsCreateOpen(false)
    setNewUser({ username: '', password: '', profile: '', macAddress: '' })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Hotspot Users</h1>
          <p className="text-muted-foreground">
            Manage user accounts and sessions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add User</DialogTitle>
                <DialogDescription>
                  Create a new hotspot user account.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <FieldGroup>
                  <Field>
                    <FieldLabel>Username</FieldLabel>
                    <Input
                      placeholder="e.g., john.doe"
                      value={newUser.username}
                      onChange={(e) =>
                        setNewUser({ ...newUser, username: e.target.value })
                      }
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Password</FieldLabel>
                    <Input
                      type="password"
                      placeholder="Enter password"
                      value={newUser.password}
                      onChange={(e) =>
                        setNewUser({ ...newUser, password: e.target.value })
                      }
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Profile</FieldLabel>
                    <Select
                      value={newUser.profile}
                      onValueChange={(v) =>
                        setNewUser({ ...newUser, profile: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select profile" />
                      </SelectTrigger>
                      <SelectContent>
                        {profiles.map((profile) => (
                          <SelectItem key={profile} value={profile}>
                            {profile}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel>MAC Address (Optional)</FieldLabel>
                    <Input
                      placeholder="AA:BB:CC:DD:EE:FF"
                      value={newUser.macAddress}
                      onChange={(e) =>
                        setNewUser({ ...newUser, macAddress: e.target.value })
                      }
                    />
                  </Field>
                </FieldGroup>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateUser}>Add User</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users or MAC..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Profile</TableHead>
              <TableHead className="hidden md:table-cell">MAC Address</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden lg:table-cell">Data Usage</TableHead>
              <TableHead className="hidden sm:table-cell">Last Seen</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.username}</TableCell>
                <TableCell>{user.profile}</TableCell>
                <TableCell className="hidden md:table-cell font-mono text-xs">
                  {user.macAddress}
                </TableCell>
                <TableCell>{getStatusBadge(user.status)}</TableCell>
                <TableCell className="hidden lg:table-cell">{user.dataUsage}</TableCell>
                <TableCell className="hidden sm:table-cell text-muted-foreground">
                  {user.lastSeen}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Reset Password
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Ban className="mr-2 h-4 w-4" />
                        {user.status === 'suspended' ? 'Unsuspend' : 'Suspend'}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive focus:text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination placeholder */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredUsers.length} of {users.length} users
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
