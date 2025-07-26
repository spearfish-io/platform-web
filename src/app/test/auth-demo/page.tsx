"use client";

import * as React from "react";
import { 
  Container, 
  Heading, 
  Text, 
  Grid, 
  Flex, 
  Box, 
  Card,
  Separator,
  Badge,
  Button,
  Code
} from "@radix-ui/themes";
import { AppShell } from "@/components/layout/app-shell";
import { CodeExample } from "@/components/test-pages";
import { UserInfo } from "@/components/auth/user-info";
import { SignoutButton } from "@/components/auth/signout-button";
import { auth } from "@/lib/auth";
import { 
  LockClosedIcon,
  PersonIcon,
  ShieldIcon,
  GearIcon,
  CheckCircledIcon,
  InfoCircledIcon
} from "@radix-ui/react-icons";

export default async function AuthDemoPage() {
  const session = await auth();

  const authSetupCode = `// Auth.js (NextAuth v5) Configuration
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        // Authenticate against Spearfish API
        const response = await fetch(\`\${API_URL}/auth/signin\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials)
        })
        
        if (response.ok) {
          const user = await response.json()
          return {
            id: user.id,
            email: user.email,
            name: user.fullName,
            primaryTenantId: user.primaryTenantId,
            roles: user.roles
          }
        }
        return null
      }
    })
  ],
  session: { strategy: "jwt", maxAge: 12 * 60 * 60 }, // 12 hours
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.primaryTenantId = user.primaryTenantId
        token.roles = user.roles
      }
      return token
    },
    session({ session, token }) {
      session.user.primaryTenantId = token.primaryTenantId
      session.user.roles = token.roles
      return session
    }
  }
})`;

  const middlewareCode = `// middleware.ts - Route Protection
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isAuthenticated = !!req.auth?.user
  const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
  
  // Redirect unauthenticated users to sign-in
  if (!isAuthenticated && !isAuthPage) {
    return NextResponse.redirect(new URL('/auth/signin', req.url))
  }
  
  // Redirect authenticated users away from auth pages
  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL('/', req.url))
  }
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}`;

  const serverComponentCode = `// Server Component with Authentication
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function ProtectedPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/auth/signin')
  }
  
  return (
    <Container>
      <Heading>Welcome, {session.user.name}!</Heading>
      <Text>Your primary tenant: {session.user.primaryTenantId}</Text>
      
      {/* Role-based content */}
      {session.user.roles?.includes('TenantAdminRole') && (
        <Card>
          <Text>Admin-only content</Text>
        </Card>
      )}
    </Container>
  )
}`;

  const clientComponentCode = `'use client'
import { useSession } from 'next-auth/react'
import { Button } from '@radix-ui/themes'

export function ClientAuthComponent() {
  const { data: session, status } = useSession()
  
  if (status === 'loading') {
    return <div>Loading...</div>
  }
  
  if (!session) {
    return <div>Please sign in to continue</div>
  }
  
  return (
    <div>
      <Text>Hello, {session.user.name}!</Text>
      <Button onClick={() => performUserAction()}>
        User Action
      </Button>
    </div>
  )
}`;

  const roleCheckingCode = `// Role-based access control utilities
import { auth } from "@/lib/auth"

export enum SpearfishRoles {
  GLOBAL_ADMIN = "GlobalAdminRole",
  TENANT_ADMIN = "TenantAdminRole", 
  TENANT_USER = "TenantUserRole",
  SALES_EMPLOYEE = "SpearfishSalesEmployeeRole"
}

export async function requireRole(role: SpearfishRoles) {
  const session = await auth()
  
  if (!session?.user?.roles?.includes(role)) {
    throw new Error('Insufficient permissions')
  }
  
  return session
}

// Usage in API routes
export async function GET() {
  await requireRole(SpearfishRoles.TENANT_ADMIN)
  
  // Admin-only logic here
  return Response.json({ data: "Admin data" })
}

// Client-side role checking
export function createRoleHelper(roles: string[] = []) {
  return {
    isGlobalAdmin: () => roles.includes(SpearfishRoles.GLOBAL_ADMIN),
    isTenantAdmin: () => roles.includes(SpearfishRoles.TENANT_ADMIN),
    isTenantUser: () => roles.includes(SpearfishRoles.TENANT_USER),
    hasAnyRole: (checkRoles: SpearfishRoles[]) => 
      checkRoles.some(role => roles.includes(role))
  }
}`;

  const sessionStructureCode = `// TypeScript Session Interface
interface SpearfishSession {
  user: {
    id: string                    // Spearfish user GUID
    email: string                 // User email address
    name: string                  // Full display name
    primaryTenantId: number       // Default tenant context
    tenantMemberships: number[]   // All accessible tenants
    roles: string[]               // Spearfish role assignments
    authType: string              // Authentication method used
  }
  tenantId: number               // Current tenant context
  roles: string[]                // Quick access to roles
}

// Example session data
const exampleSession = {
  user: {
    id: "550e8400-e29b-41d4-a716-446655440000",
    email: "john.doe@company.com",
    name: "John Doe",
    primaryTenantId: 1,
    tenantMemberships: [1, 2, 3],
    roles: ["TenantAdminRole", "TenantUserRole"],
    authType: "credentials"
  },
  tenantId: 1,
  roles: ["TenantAdminRole", "TenantUserRole"]
}`;

  return (
    <AppShell>
      <Container size="4" p="6">
        {/* Header */}
        <Box mb="8">
          <Heading size="9" mb="3">
            Authentication Integration
          </Heading>
          <Text size="4" color="gray" mb="4">
            Demonstration of Auth.js integration with Spearfish platform authentication
          </Text>
          
          <Flex align="center" gap="2" wrap="wrap">
            <Badge variant="soft" color="blue" size="2">
              Auth.js v5
            </Badge>
            <Badge variant="soft" color="green" size="2">
              JWT Sessions
            </Badge>
            <Badge variant="soft" color="purple" size="2">
              Multi-Tenant
            </Badge>
            <Badge variant="soft" color="orange" size="2">
              Role-Based Access
            </Badge>
          </Flex>
        </Box>

        {/* Current Session Info */}
        <Box mb="8">
          <Heading size="6" mb="4">Current Session</Heading>
          
          {session ? (
            <Grid columns={{ initial: "1", lg: "2" }} gap="4">
              <Card size="3" style={{ background: "var(--green-2)", border: "1px solid var(--green-6)" }}>
                <Flex align="start" gap="3">
                  <Box style={{ color: "var(--green-9)" }}>
                    <CheckCircledIcon style={{ width: "20px", height: "20px" }} />
                  </Box>
                  <Box style={{ flex: 1 }}>
                    <Heading size="4" color="green" mb="2">
                      Authenticated User
                    </Heading>
                    <UserInfo />
                    <Box mt="3">
                      <SignoutButton />
                    </Box>
                  </Box>
                </Flex>
              </Card>

              <Card size="3">
                <Flex align="start" gap="3">
                  <Box style={{ color: "var(--blue-9)" }}>
                    <InfoCircledIcon style={{ width: "20px", height: "20px" }} />
                  </Box>
                  <Box>
                    <Heading size="4" mb="3">Session Details</Heading>
                    <Flex direction="column" gap="2">
                      <Box>
                        <Text size="2" weight="medium">User ID:</Text>
                        <Code size="1">{session.user.id}</Code>
                      </Box>
                      <Box>
                        <Text size="2" weight="medium">Email:</Text>
                        <Code size="1">{session.user.email}</Code>
                      </Box>
                      {session.user.primaryTenantId && (
                        <Box>
                          <Text size="2" weight="medium">Primary Tenant:</Text>
                          <Code size="1">{session.user.primaryTenantId}</Code>
                        </Box>
                      )}
                      {session.user.roles && session.user.roles.length > 0 && (
                        <Box>
                          <Text size="2" weight="medium">Roles:</Text>
                          <Flex gap="1" wrap="wrap" mt="1">
                            {session.user.roles.map((role: string) => (
                              <Badge key={role} variant="soft" size="1">
                                {role}
                              </Badge>
                            ))}
                          </Flex>
                        </Box>
                      )}
                    </Flex>
                  </Box>
                </Flex>
              </Card>
            </Grid>
          ) : (
            <Card size="3" style={{ background: "var(--red-2)", border: "1px solid var(--red-6)" }}>
              <Flex align="center" gap="3">
                <Box style={{ color: "var(--red-9)" }}>
                  <LockClosedIcon style={{ width: "20px", height: "20px" }} />
                </Box>
                <Box>
                  <Heading size="4" color="red" mb="2">
                    No Active Session
                  </Heading>
                  <Text size="2" color="red" mb="3">
                    You are not currently authenticated. This page is accessible 
                    because authentication is handled at the middleware level.
                  </Text>
                  <Button variant="solid" color="red" asChild>
                    <a href="/auth/signin">Sign In</a>
                  </Button>
                </Box>
              </Flex>
            </Card>
          )}
        </Box>

        <Separator size="4" mb="8" />

        {/* Authentication Features */}
        <Box mb="8">
          <Heading size="6" mb="4">Authentication Features</Heading>
          
          <Grid columns={{ initial: "1", md: "2" }} gap="4" mb="6">
            <Card size="3">
              <Flex align="start" gap="3">
                <Box style={{ color: "var(--blue-9)" }}>
                  <PersonIcon style={{ width: "20px", height: "20px" }} />
                </Box>
                <Box>
                  <Heading size="4" mb="2">Spearfish Integration</Heading>
                  <Text size="2" color="gray" mb="3">
                    Seamless integration with existing Spearfish authentication API. 
                    Preserves all user data, roles, and tenant relationships.
                  </Text>
                  <Badge variant="soft" color="blue" size="1">Credentials Provider</Badge>
                </Box>
              </Flex>
            </Card>

            <Card size="3">
              <Flex align="start" gap="3">
                <Box style={{ color: "var(--green-9)" }}>
                  <ShieldIcon style={{ width: "20px", height: "20px" }} />
                </Box>
                <Box>
                  <Heading size="4" mb="2">JWT Sessions</Heading>
                  <Text size="2" color="gray" mb="3">
                    Stateless JWT tokens with 12-hour expiration. Automatic token 
                    rotation and secure HttpOnly cookies prevent XSS attacks.
                  </Text>
                  <Badge variant="soft" color="green" size="1">Secure</Badge>
                </Box>
              </Flex>
            </Card>

            <Card size="3">
              <Flex align="start" gap="3">
                <Box style={{ color: "var(--purple-9)" }}>
                  <GearIcon style={{ width: "20px", height: "20px" }} />
                </Box>
                <Box>
                  <Heading size="4" mb="2">Multi-Tenant Support</Heading>
                  <Text size="2" color="gray" mb="3">
                    Full tenant context with primary tenant ID and complete tenant 
                    memberships. Tenant-aware access control and data isolation.
                  </Text>
                  <Badge variant="soft" color="purple" size="1">Enterprise</Badge>
                </Box>
              </Flex>
            </Card>

            <Card size="3">
              <Flex align="start" gap="3">
                <Box style={{ color: "var(--orange-9)" }}>
                  <LockClosedIcon style={{ width: "20px", height: "20px" }} />
                </Box>
                <Box>
                  <Heading size="4" mb="2">Role-Based Access</Heading>
                  <Text size="2" color="gray" mb="3">
                    Complete Spearfish role system integration with server-side 
                    and client-side role checking utilities.
                  </Text>
                  <Badge variant="soft" color="orange" size="1">RBAC</Badge>
                </Box>
              </Flex>
            </Card>
          </Grid>
        </Box>

        <Separator size="4" mb="8" />

        {/* Implementation Examples */}
        <Box mb="8">
          <Heading size="6" mb="4">Implementation Examples</Heading>
          
          <Grid columns={{ initial: "1" }} gap="6">
            <CodeExample
              title="Auth.js Configuration"
              description="NextAuth v5 setup with Spearfish credentials provider"
              code={authSetupCode}
            />

            <CodeExample
              title="Middleware Route Protection"
              description="Automatic route protection with authentication checks"
              code={middlewareCode}
            />

            <CodeExample
              title="Server Component Authentication"
              description="Server-side authentication and role-based content"
              code={serverComponentCode}
            />

            <CodeExample
              title="Client Component Authentication"
              description="Client-side session handling with useSession hook"
              code={clientComponentCode}
            />

            <CodeExample
              title="Role-Based Access Control"
              description="Server and client-side role checking utilities"
              code={roleCheckingCode}
            />

            <CodeExample
              title="Session Data Structure"
              description="TypeScript interfaces and example session data"
              code={sessionStructureCode}
            />
          </Grid>
        </Box>

        <Separator size="4" mb="8" />

        {/* Security Features */}
        <Box mb="8">
          <Heading size="6" mb="4">Security Features</Heading>
          
          <Grid columns={{ initial: "1", lg: "2" }} gap="4">
            <Card size="3" style={{ background: "var(--green-2)", border: "1px solid var(--green-6)" }}>
              <Heading size="4" color="green" mb="3">✅ Security Measures</Heading>
              <Flex direction="column" gap="2">
                <Text size="2" color="green">• JWT tokens encrypted with server-side secret</Text>
                <Text size="2" color="green">• Automatic token rotation on each request</Text>
                <Text size="2" color="green">• Secure HttpOnly cookies prevent XSS</Text>
                <Text size="2" color="green">• CSRF protection built into Auth.js</Text>
                <Text size="2" color="green">• Session timeout and sliding renewal</Text>
                <Text size="2" color="green">• No credential storage in frontend</Text>
              </Flex>
            </Card>

            <Card size="3" style={{ background: "var(--blue-2)", border: "1px solid var(--blue-6)" }}>
              <Heading size="4" color="blue" mb="3">🔒 Access Control</Heading>
              <Flex direction="column" gap="2">
                <Text size="2" color="blue">• Server-side session validation</Text>
                <Text size="2" color="blue">• Middleware-based route protection</Text>
                <Text size="2" color="blue">• Role-based content rendering</Text>
                <Text size="2" color="blue">• Tenant-aware data access</Text>
                <Text size="2" color="blue">• API endpoint protection</Text>
                <Text size="2" color="blue">• Automatic redirect handling</Text>
              </Flex>
            </Card>
          </Grid>
        </Box>

        {/* Quick Actions */}
        <Box>
          <Heading size="5" mb="4">Authentication Actions</Heading>
          <Flex gap="3" wrap="wrap">
            {!session ? (
              <>
                <Button variant="solid" asChild>
                  <a href="/auth/signin">Sign In</a>
                </Button>
                <Button variant="soft" asChild>
                  <a href="/auth/signin?demo=true">Demo Account</a>
                </Button>
              </>
            ) : (
              <>
                <SignoutButton />
                <Button variant="soft" asChild>
                  <a href="/settings">User Settings</a>
                </Button>
              </>
            )}
            <Button variant="outline" asChild>
              <a href="/patterns">Development Patterns</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/components">Component Library</a>
            </Button>
          </Flex>
        </Box>
      </Container>
    </AppShell>
  );
}