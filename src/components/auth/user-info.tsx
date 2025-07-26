"use client"

import { useSession, signOut } from "next-auth/react"
import { Button, Text, Flex, DropdownMenu, Avatar, Badge } from "@radix-ui/themes"
import { PersonIcon, ExitIcon, GearIcon } from "@radix-ui/react-icons"
import { createRoleHelper, SpearfishRoles } from "@/types/auth"

export function UserInfo() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <Flex align="center" gap="2">
        <Text size="2" color="gray">Loading...</Text>
      </Flex>
    )
  }

  if (!session?.user) {
    return null
  }

  const user = session.user
  const roleHelper = createRoleHelper(user.roles)

  const handleSignOut = () => {
    signOut({ callbackUrl: "/auth/signin" })
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button variant="ghost" style={{ padding: "var(--space-2)" }}>
          <Flex align="center" gap="2">
            <Avatar
              size="2"
              fallback={<PersonIcon />}
              radius="full"
            />
            <Flex direction="column" align="start" gap="1">
              <Text size="2" weight="medium">
                {user.name || user.email}
              </Text>
              <Flex align="center" gap="1">
                <Text size="1" color="gray">
                  Tenant: {user.primaryTenantId}
                </Text>
                {roleHelper.isGlobalAdmin() && (
                  <Badge color="red" size="1">Global Admin</Badge>
                )}
                {roleHelper.isTenantAdmin() && !roleHelper.isGlobalAdmin() && (
                  <Badge color="blue" size="1">Admin</Badge>
                )}
              </Flex>
            </Flex>
          </Flex>
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content align="end" style={{ minWidth: "200px" }}>
        <DropdownMenu.Label>
          <Flex direction="column" gap="1">
            <Text size="2" weight="medium">
              {user.name || "User"}
            </Text>
            <Text size="1" color="gray">
              {user.email}
            </Text>
          </Flex>
        </DropdownMenu.Label>
        
        <DropdownMenu.Separator />
        
        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger>
            <PersonIcon />
            Profile Info
          </DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent>
            <DropdownMenu.Item>
              <Text size="1">
                <strong>User ID:</strong> {user.id}
              </Text>
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              <Text size="1">
                <strong>Primary Tenant:</strong> {user.primaryTenantId}
              </Text>
            </DropdownMenu.Item>
            {user.tenantMemberships && user.tenantMemberships.length > 1 && (
              <DropdownMenu.Item>
                <Text size="1">
                  <strong>Other Tenants:</strong> {user.tenantMemberships.filter(t => t !== user.primaryTenantId).join(", ")}
                </Text>
              </DropdownMenu.Item>
            )}
            <DropdownMenu.Item>
              <Text size="1">
                <strong>Auth Type:</strong> {user.authType || "credentials"}
              </Text>
            </DropdownMenu.Item>
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>

        {user.roles && user.roles.length > 0 && (
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>
              <GearIcon />
              Roles
            </DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              {user.roles.map((role) => (
                <DropdownMenu.Item key={role}>
                  <Badge 
                    color={role === SpearfishRoles.GLOBAL_ADMIN ? "red" : 
                           role === SpearfishRoles.TENANT_ADMIN ? "blue" : "gray"}
                    size="1"
                  >
                    {role}
                  </Badge>
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
        )}
        
        <DropdownMenu.Separator />
        
        <DropdownMenu.Item onClick={handleSignOut} color="red">
          <ExitIcon />
          Sign Out
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}