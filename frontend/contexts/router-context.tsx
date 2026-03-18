'use client'

import * as React from 'react'

export interface RouterType {
  id: string
  name: string
  ip: string
  port: number
  username: string
  status: 'online' | 'offline' | 'connecting'
  location?: string
  uptime?: string
  model?: string
  version?: string
}

interface RouterContextType {
  routers: RouterType[]
  selectedRouter: RouterType | null
  setSelectedRouter: (router: RouterType | null) => void
  addRouter: (router: RouterType) => void
  removeRouter: (id: string) => void
  updateRouter: (id: string, data: Partial<RouterType>) => void
  isLoading: boolean
}

const RouterContext = React.createContext<RouterContextType | null>(null)

export function useRouter() {
  const context = React.useContext(RouterContext)
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider')
  }
  return context
}

interface RouterProviderProps {
  children: React.ReactNode
}

export function RouterProvider({ children }: RouterProviderProps) {
  const [routers, setRouters] = React.useState<RouterType[]>([
    {
      id: '1',
      name: 'Office Router',
      ip: '192.168.88.1',
      port: 8728,
      username: 'admin',
      status: 'online',
      location: 'Main Office',
      uptime: '15 days 4 hours',
      model: 'RB4011iGS+',
      version: '7.12',
    },
    {
      id: '2',
      name: 'Branch Router',
      ip: '10.0.0.1',
      port: 8728,
      username: 'admin',
      status: 'offline',
      location: 'Branch Office',
    },
  ])
  const [selectedRouter, setSelectedRouter] = React.useState<RouterType | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  const addRouter = React.useCallback((router: RouterType) => {
    setRouters((prev) => [...prev, router])
  }, [])

  const removeRouter = React.useCallback((id: string) => {
    setRouters((prev) => prev.filter((r) => r.id !== id))
    if (selectedRouter?.id === id) {
      setSelectedRouter(null)
    }
  }, [selectedRouter])

  const updateRouter = React.useCallback((id: string, data: Partial<RouterType>) => {
    setRouters((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...data } : r))
    )
  }, [])

  const value = React.useMemo(
    () => ({
      routers,
      selectedRouter,
      setSelectedRouter,
      addRouter,
      removeRouter,
      updateRouter,
      isLoading,
    }),
    [routers, selectedRouter, addRouter, removeRouter, updateRouter, isLoading]
  )

  return (
    <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
  )
}
