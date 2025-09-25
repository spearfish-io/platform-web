'use client'

import { useState, useMemo, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { Button, Dialog, Flex, Text, Box, TextField, Tabs, ScrollArea, Badge } from '@radix-ui/themes'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons'
import type { Tenant } from '@/types/tenant'
import type { SpearfishSession } from '@/types/auth'
import { createRoleHelper, SpearfishRoles } from '@/types/auth'
import { useTenants } from '@/contexts/tenant-context'

// Map tenant types to display names
const TENANT_TYPE_DISPLAY_NAMES = {
  'CustomerProduction': 'Production',
  'CustomerSandbox': 'Sandbox', 
  'Development': 'Development',
  'SalesDemo': 'Demo'
} as const

interface TenantSwitcherProps {
  className?: string
}

export function TenantSwitcher({ className }: TenantSwitcherProps) {
  const { data: session } = useSession() as { data: SpearfishSession | null }
  const { tenants, currentTenantId, currentTenant, isSwitching, switchTenant } = useTenants()
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<string>('')
  
  const roleHelper = createRoleHelper(session?.user?.roles)
  
  // Group tenants by type and sort alphabetically within each type
  const tenantsByType = useMemo(() => {
    const groupedTenants: Record<string, Tenant[]> = {}
    
    tenants.forEach(tenant => {
      const typeKey = tenant.type || 'Unknown'
      const displayKey = TENANT_TYPE_DISPLAY_NAMES[typeKey as keyof typeof TENANT_TYPE_DISPLAY_NAMES] || typeKey
      
      if (!groupedTenants[displayKey]) {
        groupedTenants[displayKey] = []
      }
      groupedTenants[displayKey].push(tenant)
    })
    
    // Sort each group alphabetically
    Object.keys(groupedTenants).forEach(type => {
      groupedTenants[type].sort((a, b) => a.name.localeCompare(b.name))
    })
    
    return groupedTenants
  }, [tenants])
  
  // Get unique tenant types
  const tenantTypes = useMemo(() => {
    const types = Object.keys(tenantsByType)
    
    // If Demo exists, move it to the front
    const demoIndex = types.indexOf('Demo')
    if (demoIndex > -1) {
      types.splice(demoIndex, 1)
      types.unshift('Demo')
    }
    
    return types
  }, [tenantsByType])
  
  // Set default active tab when modal opens
  useMemo(() => {
    if (tenantTypes.length > 0 && !activeTab) {
      setActiveTab(tenantTypes[0])
    }
  }, [tenantTypes, activeTab])
  
  // Filter tenants based on search query and active tab
  const filteredTenants = useMemo(() => {
    if (!activeTab) return []
    
    return tenantsByType[activeTab]?.filter(tenant =>
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || []
  }, [tenantsByType, activeTab, searchQuery])
  
  const handleTenantSelect = useCallback(async (tenant: Tenant) => {
    if (tenant.id === currentTenantId) return // Already selected
    
    try {
      setOpen(false)
      await switchTenant(tenant.id)
    } catch (error) {
      console.error('Failed to switch tenant:', error)
      // TODO: Show error notification
    }
  }, [currentTenantId, switchTenant])
  
  if (tenants.length === 0) {
    return null // Don't show if no tenants available
  }
  
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button 
          variant="ghost" 
          color="gray"
          disabled={isSwitching}
          style={{ 
            minWidth: '200px',
            justifyContent: 'space-between'
          }}
          className={className}
        >
          <Text size="2" weight="medium">
            {isSwitching ? 'Switching...' : (currentTenant?.name || 'Select Tenant')}
          </Text>
          <ChevronDownIcon />
        </Button>
      </Dialog.Trigger>
      
      <Dialog.Content maxWidth="500px">
        <Dialog.Title>Switch Tenant</Dialog.Title>
        
        <Box mt="4" mb="3">
          <TextField.Root
            placeholder="Search tenants..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          >
            <TextField.Slot>
              <MagnifyingGlassIcon height="16" width="16" />
            </TextField.Slot>
          </TextField.Root>
        </Box>
        
        {tenantTypes.length > 1 ? (
          <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
            <Tabs.List style={{ marginBottom: '16px' }}>
              {tenantTypes.map((type) => (
                <Tabs.Trigger key={type} value={type}>
                  {type}
                </Tabs.Trigger>
              ))}
            </Tabs.List>
            
            {tenantTypes.map((type) => (
              <Tabs.Content key={type} value={type}>
                <ScrollArea style={{ height: '300px' }}>
                  <Flex direction="column" gap="2">
                    {filteredTenants.map((tenant) => (
                      <Box
                        key={tenant.id}
                        p="3"
                        style={{
                          borderRadius: '6px',
                          cursor: 'pointer',
                          backgroundColor: tenant.id === currentTenantId ? 'var(--accent-3)' : 'transparent'
                        }}
                        className="hover:bg-gray-2"
                        onClick={() => handleTenantSelect(tenant)}
                      >
                        <Flex align="center" justify="between">
                          <Box>
                            <Text size="2" weight={tenant.id === currentTenantId ? "bold" : "regular"}>
                              {tenant.name}
                            </Text>
                            <Text size="1" color="gray" style={{ marginTop: '2px' }}>
                              ID: {tenant.id}
                            </Text>
                          </Box>
                          <Badge color={tenant.id === currentTenantId ? "blue" : "gray"} size="1">
                            {tenant.id === currentTenantId ? "Active" : "Switch"}
                          </Badge>
                        </Flex>
                        {tenant.description && (
                          <Text size="1" color="gray" style={{ marginTop: '4px' }}>
                            {tenant.description}
                          </Text>
                        )}
                      </Box>
                    ))}
                  </Flex>
                </ScrollArea>
              </Tabs.Content>
            ))}
          </Tabs.Root>
        ) : (
          <ScrollArea style={{ height: '300px' }}>
            <Flex direction="column" gap="2">
              {filteredTenants.map((tenant) => (
                <Box
                  key={tenant.id}
                  p="3"
                  style={{
                    borderRadius: '6px',
                    cursor: 'pointer',
                    backgroundColor: tenant.id === currentTenantId ? 'var(--accent-3)' : 'transparent'
                  }}
                  className="hover:bg-gray-2"
                  onClick={() => handleTenantSelect(tenant)}
                >
                  <Flex align="center" justify="between">
                    <Box>
                      <Text size="2" weight={tenant.id === currentTenantId ? "bold" : "regular"}>
                        {tenant.name}
                      </Text>
                      <Text size="1" color="gray" style={{ marginTop: '2px' }}>
                        ID: {tenant.id}
                      </Text>
                    </Box>
                    <Badge color={tenant.id === currentTenantId ? "blue" : "gray"} size="1">
                      {tenant.id === currentTenantId ? "Active" : "Switch"}
                    </Badge>
                  </Flex>
                  {tenant.description && (
                    <Text size="1" color="gray" style={{ marginTop: '4px' }}>
                      {tenant.description}
                    </Text>
                  )}
                </Box>
              ))}
            </Flex>
          </ScrollArea>
        )}
      </Dialog.Content>
    </Dialog.Root>
  )
}