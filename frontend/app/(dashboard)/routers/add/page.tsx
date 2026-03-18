'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  ArrowRight,
  Router,
  Check,
  Copy,
  Download,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

const steps = [
  { id: 'details', title: 'Router Details', description: 'Enter connection information' },
  { id: 'scripts', title: 'Setup Scripts', description: 'Configure your router' },
  { id: 'verify', title: 'Verification', description: 'Confirm connection' },
]

const setupScripts = {
  api: `/ip service set api disabled=no
/ip service set api-ssl disabled=no
/user add name=mikrobill group=full password=YOUR_SECURE_PASSWORD`,

  firewall: `/ip firewall filter add chain=input protocol=tcp dst-port=8728 action=accept comment="Allow MikroBill API"
/ip firewall filter add chain=input protocol=tcp dst-port=8729 action=accept comment="Allow MikroBill API-SSL"`,

  wireguard: `/interface wireguard add name=wg-mikrobill listen-port=13231
/interface wireguard peers add interface=wg-mikrobill public-key="SERVER_PUBLIC_KEY" endpoint="vpn.mikrobill.com:51820" allowed-address=10.10.0.0/24
/ip address add address=10.10.0.2/24 interface=wg-mikrobill`,
}

export default function AddRouterPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = React.useState(0)
  const [isLoading, setIsLoading] = React.useState(false)
  const [isTesting, setIsTesting] = React.useState(false)
  const [testResult, setTestResult] = React.useState<'success' | 'error' | null>(null)
  const [verificationStatus, setVerificationStatus] = React.useState<'idle' | 'verifying' | 'success' | 'error'>('idle')
  const [copiedScript, setCopiedScript] = React.useState<string | null>(null)
  
  const [formData, setFormData] = React.useState({
    name: '',
    ip: '',
    port: '8728',
    username: 'admin',
    password: '',
    location: '',
  })

  const handleCopyScript = async (key: string, script: string) => {
    await navigator.clipboard.writeText(script)
    setCopiedScript(key)
    setTimeout(() => setCopiedScript(null), 2000)
  }

  const handleDownloadScript = () => {
    const allScripts = Object.entries(setupScripts)
      .map(([key, script]) => `# ${key.toUpperCase()} Configuration\n${script}`)
      .join('\n\n')
    
    const blob = new Blob([allScripts], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mikrobill-setup-${formData.name || 'router'}.rsc`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleTestConnection = async () => {
    setIsTesting(true)
    setTestResult(null)
    
    // Simulate connection test
    await new Promise((resolve) => setTimeout(resolve, 2000))
    
    // Simulate success (in real app, this would call an API)
    setTestResult(Math.random() > 0.3 ? 'success' : 'error')
    setIsTesting(false)
  }

  const handleVerifyRouter = async () => {
    setVerificationStatus('verifying')
    
    // Simulate verification
    await new Promise((resolve) => setTimeout(resolve, 3000))
    
    setVerificationStatus('success')
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    router.push('/routers')
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return formData.name && formData.ip && formData.port && formData.username && formData.password
      case 1:
        return true
      case 2:
        return verificationStatus === 'success'
      default:
        return false
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/routers">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Add Router</h1>
          <p className="text-muted-foreground">
            Connect a new MikroTik router to your account
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex items-center gap-3">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                  index < currentStep
                    ? 'bg-primary text-primary-foreground'
                    : index === currentStep
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {index < currentStep ? (
                  <Check className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium">{step.title}</p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-px flex-1 mx-4 ${
                  index < currentStep ? 'bg-primary' : 'bg-border'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep].title}</CardTitle>
          <CardDescription>{steps[currentStep].description}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Step 1: Router Details */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Router Name</FieldLabel>
                  <Input
                    id="name"
                    placeholder="e.g., Office Router"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="ip">IP Address / Domain</FieldLabel>
                    <Input
                      id="ip"
                      placeholder="192.168.88.1"
                      value={formData.ip}
                      onChange={(e) => setFormData({ ...formData, ip: e.target.value })}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="port">API Port</FieldLabel>
                    <Input
                      id="port"
                      placeholder="8728"
                      value={formData.port}
                      onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                    />
                  </Field>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="username">Username</FieldLabel>
                    <Input
                      id="username"
                      placeholder="admin"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </Field>
                </div>
                <Field>
                  <FieldLabel htmlFor="location">Location (Optional)</FieldLabel>
                  <Input
                    id="location"
                    placeholder="e.g., Main Office, Building A"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </Field>
              </FieldGroup>

              <div className="flex items-center gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={handleTestConnection}
                  disabled={isTesting || !formData.ip || !formData.port}
                >
                  {isTesting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    'Test Connection'
                  )}
                </Button>
                {testResult === 'success' && (
                  <Badge variant="default" className="bg-primary/10 text-primary">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Connection successful
                  </Badge>
                )}
                {testResult === 'error' && (
                  <Badge variant="destructive">
                    <AlertCircle className="mr-1 h-3 w-3" />
                    Connection failed
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Setup Scripts */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  Run these scripts on your MikroTik router to enable API access and secure connectivity.
                  Connect to your router via Winbox or SSH to execute these commands.
                </AlertDescription>
              </Alert>

              <Tabs defaultValue="api" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="api">Enable API</TabsTrigger>
                  <TabsTrigger value="firewall">Firewall Rules</TabsTrigger>
                  <TabsTrigger value="wireguard">WireGuard VPN</TabsTrigger>
                </TabsList>
                {Object.entries(setupScripts).map(([key, script]) => (
                  <TabsContent key={key} value={key} className="space-y-3">
                    <div className="relative">
                      <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm font-mono">
                        <code>{script}</code>
                      </pre>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2"
                        onClick={() => handleCopyScript(key, script)}
                      >
                        {copiedScript === key ? (
                          <Check className="h-4 w-4 text-primary" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>

              <div className="flex gap-3">
                <Button variant="outline" onClick={handleDownloadScript}>
                  <Download className="mr-2 h-4 w-4" />
                  Download All Scripts
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Verification */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center py-8">
                {verificationStatus === 'idle' && (
                  <div className="space-y-4">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                      <Router className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">Ready to verify</h3>
                      <p className="text-sm text-muted-foreground">
                        Click the button below after you have run the setup scripts on your router.
                      </p>
                    </div>
                    <Button onClick={handleVerifyRouter}>
                      Verify Router Connection
                    </Button>
                  </div>
                )}

                {verificationStatus === 'verifying' && (
                  <div className="space-y-4">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">Verifying connection...</h3>
                      <p className="text-sm text-muted-foreground">
                        Attempting to connect to {formData.ip}:{formData.port}
                      </p>
                    </div>
                  </div>
                )}

                {verificationStatus === 'success' && (
                  <div className="space-y-4">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <CheckCircle2 className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">Router connected successfully!</h3>
                      <p className="text-sm text-muted-foreground">
                        Your router is now ready to be managed through MikroBill.
                      </p>
                    </div>
                  </div>
                )}

                {verificationStatus === 'error' && (
                  <div className="space-y-4">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                      <AlertCircle className="h-8 w-8 text-destructive" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">Connection failed</h3>
                      <p className="text-sm text-muted-foreground">
                        Could not establish connection. Please verify your settings and try again.
                      </p>
                    </div>
                    <Button variant="outline" onClick={() => setVerificationStatus('idle')}>
                      Try Again
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep((s) => s - 1)}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        
        {currentStep < steps.length - 1 ? (
          <Button
            onClick={() => setCurrentStep((s) => s + 1)}
            disabled={!canProceed()}
          >
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={!canProceed() || isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding Router...
              </>
            ) : (
              'Complete Setup'
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
