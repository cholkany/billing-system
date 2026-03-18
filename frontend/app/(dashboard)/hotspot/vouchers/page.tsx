'use client'

import * as React from 'react'
import {
  Plus,
  Search,
  Ticket,
  Download,
  Printer,
  Filter,
  Copy,
  Check,
  Trash2,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
import { Checkbox } from '@/components/ui/checkbox'

interface Voucher {
  id: string
  code: string
  profile: string
  status: 'unused' | 'used' | 'expired'
  batchName: string
  usedBy?: string
  usedAt?: string
  createdAt: string
  expiresAt: string
}

const mockVouchers: Voucher[] = [
  {
    id: '1',
    code: 'DAILY-A7B2C9',
    profile: 'Daily Standard',
    status: 'unused',
    batchName: 'DAILY-BATCH-01',
    createdAt: '2024-01-20',
    expiresAt: '2024-02-20',
  },
  {
    id: '2',
    code: 'DAILY-X3Y4Z5',
    profile: 'Daily Standard',
    status: 'used',
    batchName: 'DAILY-BATCH-01',
    usedBy: 'john.doe',
    usedAt: '2024-01-21',
    createdAt: '2024-01-20',
    expiresAt: '2024-02-20',
  },
  {
    id: '3',
    code: 'HOUR-P1Q2R3',
    profile: 'Hourly Basic',
    status: 'expired',
    batchName: 'HOURLY-BATCH-02',
    createdAt: '2024-01-15',
    expiresAt: '2024-01-16',
  },
  {
    id: '4',
    code: 'WEEK-M4N5O6',
    profile: 'Weekly Premium',
    status: 'unused',
    batchName: 'WEEKLY-BATCH-01',
    createdAt: '2024-01-18',
    expiresAt: '2024-02-18',
  },
  {
    id: '5',
    code: 'DAILY-K7L8M9',
    profile: 'Daily Standard',
    status: 'unused',
    batchName: 'DAILY-BATCH-01',
    createdAt: '2024-01-20',
    expiresAt: '2024-02-20',
  },
]

const profiles = ['Hourly Basic', 'Daily Standard', 'Weekly Premium', 'Monthly Unlimited']

export default function VouchersPage() {
  const [vouchers, setVouchers] = React.useState(mockVouchers)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<string>('all')
  const [isGenerateOpen, setIsGenerateOpen] = React.useState(false)
  const [selectedVouchers, setSelectedVouchers] = React.useState<string[]>([])
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null)
  const [batchConfig, setBatchConfig] = React.useState({
    batchName: '',
    profile: '',
    amount: '10',
    prefix: '',
  })

  const filteredVouchers = vouchers.filter((voucher) => {
    const matchesSearch =
      voucher.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voucher.batchName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || voucher.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: Voucher['status']) => {
    switch (status) {
      case 'unused':
        return (
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
            Unused
          </Badge>
        )
      case 'used':
        return <Badge variant="secondary">Used</Badge>
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>
    }
  }

  const handleCopyCode = async (code: string) => {
    await navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const generateRandomCode = (prefix: string) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return prefix ? `${prefix}-${code}` : code
  }

  const handleGenerateBatch = () => {
    const amount = parseInt(batchConfig.amount)
    const newVouchers: Voucher[] = []
    
    for (let i = 0; i < amount; i++) {
      newVouchers.push({
        id: String(vouchers.length + i + 1),
        code: generateRandomCode(batchConfig.prefix || batchConfig.profile.split(' ')[0].toUpperCase()),
        profile: batchConfig.profile,
        status: 'unused',
        batchName: batchConfig.batchName,
        createdAt: new Date().toISOString().split('T')[0],
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      })
    }
    
    setVouchers([...newVouchers, ...vouchers])
    setIsGenerateOpen(false)
    setBatchConfig({ batchName: '', profile: '', amount: '10', prefix: '' })
  }

  const toggleSelectAll = () => {
    if (selectedVouchers.length === filteredVouchers.length) {
      setSelectedVouchers([])
    } else {
      setSelectedVouchers(filteredVouchers.map((v) => v.id))
    }
  }

  const toggleSelectVoucher = (id: string) => {
    setSelectedVouchers((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    )
  }

  // Stats
  const stats = {
    total: vouchers.length,
    unused: vouchers.filter((v) => v.status === 'unused').length,
    used: vouchers.filter((v) => v.status === 'used').length,
    expired: vouchers.filter((v) => v.status === 'expired').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vouchers</h1>
          <p className="text-muted-foreground">
            Generate and manage hotspot vouchers
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" disabled={selectedVouchers.length === 0}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={isGenerateOpen} onOpenChange={setIsGenerateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Generate Batch
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate Voucher Batch</DialogTitle>
                <DialogDescription>
                  Create multiple vouchers with the same profile settings.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <FieldGroup>
                  <Field>
                    <FieldLabel>Batch Name</FieldLabel>
                    <Input
                      placeholder="e.g., DAILY-BATCH-02"
                      value={batchConfig.batchName}
                      onChange={(e) =>
                        setBatchConfig({ ...batchConfig, batchName: e.target.value })
                      }
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Profile</FieldLabel>
                    <Select
                      value={batchConfig.profile}
                      onValueChange={(v) =>
                        setBatchConfig({ ...batchConfig, profile: v })
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
                    <FieldLabel>Amount</FieldLabel>
                    <Select
                      value={batchConfig.amount}
                      onValueChange={(v) =>
                        setBatchConfig({ ...batchConfig, amount: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[10, 25, 50, 100, 200].map((n) => (
                          <SelectItem key={n} value={String(n)}>
                            {n} vouchers
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel>Code Prefix (Optional)</FieldLabel>
                    <Input
                      placeholder="e.g., CAFE"
                      value={batchConfig.prefix}
                      onChange={(e) =>
                        setBatchConfig({ ...batchConfig, prefix: e.target.value.toUpperCase() })
                      }
                    />
                  </Field>
                </FieldGroup>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsGenerateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleGenerateBatch}>Generate Vouchers</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Vouchers</CardDescription>
            <CardTitle className="text-2xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Unused</CardDescription>
            <CardTitle className="text-2xl text-primary">{stats.unused}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Used</CardDescription>
            <CardTitle className="text-2xl">{stats.used}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Expired</CardDescription>
            <CardTitle className="text-2xl text-destructive">{stats.expired}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search vouchers..."
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
            <SelectItem value="unused">Unused</SelectItem>
            <SelectItem value="used">Used</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
        {selectedVouchers.length > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              setVouchers(vouchers.filter((v) => !selectedVouchers.includes(v.id)))
              setSelectedVouchers([])
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete ({selectedVouchers.length})
          </Button>
        )}
      </div>

      {/* Vouchers Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={
                    selectedVouchers.length === filteredVouchers.length &&
                    filteredVouchers.length > 0
                  }
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Profile</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Batch</TableHead>
              <TableHead className="hidden lg:table-cell">Used By</TableHead>
              <TableHead className="hidden sm:table-cell">Expires</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVouchers.map((voucher) => (
              <TableRow key={voucher.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedVouchers.includes(voucher.id)}
                    onCheckedChange={() => toggleSelectVoucher(voucher.id)}
                  />
                </TableCell>
                <TableCell className="font-mono font-medium">{voucher.code}</TableCell>
                <TableCell>{voucher.profile}</TableCell>
                <TableCell>{getStatusBadge(voucher.status)}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  {voucher.batchName}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {voucher.usedBy || '-'}
                </TableCell>
                <TableCell className="hidden sm:table-cell text-muted-foreground">
                  {voucher.expiresAt}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleCopyCode(voucher.code)}
                  >
                    {copiedCode === voucher.code ? (
                      <Check className="h-4 w-4 text-primary" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredVouchers.length} of {vouchers.length} vouchers
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
