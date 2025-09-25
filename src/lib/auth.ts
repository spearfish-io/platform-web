import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { env } from "@/lib/env"
import { refreshAccessToken } from "@/lib/auth-utils"
import type { SpearfishUser } from "@/types/auth"

/**
 * Auth.js Configuration for Spearfish Platform
 * 
 * Integrates with the existing Spearfish authentication API while providing
 * modern session management and route protection for the Next.js frontend.
 */
export const authConfig = {
  debug: env.NODE_ENV === "development",
  trustHost: true,
  logger: {
    error(code, metadata) {
      console.error(`[AUTH_ERROR] ${code}:`, metadata)
    },
    warn(code) {
      console.warn(`[AUTH_WARN] ${code}`)
    },
    debug(code, metadata) {
      if (env.NODE_ENV === "development") {
        console.debug(`[AUTH_DEBUG] ${code}:`, metadata)
      }
    },
  },
  providers: [
    /**
     * Spearfish Mock Credentials Provider (for MSW mock authentication)
     * Only enabled in mock mode for development/testing
     */
    Credentials({
      id: "spearfish-mock",
      name: "Spearfish Mock",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Only allow in mock mode
        if (process.env.NEXT_PUBLIC_AUTH_MODE?.toLowerCase() !== 'mock') {
          return null
        }

        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Call the mock API endpoint (will be intercepted by MSW)
          const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })

          const data = await response.json()

          if (!response.ok || !data.success) {
            return null
          }

          // Return user object that matches SpearfishUser type
          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.fullName,
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            userName: data.user.userName,
            primaryTenantId: data.user.primaryTenantId,
            tenantMemberships: data.user.tenantMemberships,
            roles: data.user.roles,
            authType: data.user.authType,
          }
        } catch (error) {
          console.error("Authentication error:", error)
          return null
        }
      },
    }),

    /**
     * Spearfish OIDC Provider (OpenID Connect)
     * Uses the proper OIDC endpoints from the Identity API with OpenIddict
     * This is the primary authentication method for the platform
     */
    {
      id: "spearfish-oidc",
      name: "Spearfish Identity",
      type: "oidc" as const,
      clientId: "platform-web", // Pre-configured client in Identity API
      clientSecret: undefined, // Public client (PKCE)
      issuer: env.NEXT_PUBLIC_API_URL.replace(/\/$/, ''), // Use configured protocol
      authorization: {
        params: {
          scope: "openid profile email offline_access tenant:read tenant:write user:read user:write",
          response_type: "code",
          code_challenge_method: "S256", // PKCE
          prompt: "select_account", // Force account selection for better UX
        }
      },
      wellKnown: `${env.NEXT_PUBLIC_API_URL.replace(/\/$/, '')}/.well-known/openid-configuration`,
      checks: ["pkce", "state"],
      client: {
        token_endpoint_auth_method: "none", // Public client with PKCE
      },
      httpOptions: {
        timeout: 10000, // 10 second timeout
      },
      profile(profile: any) {
        // Validate required OIDC claims
        if (!profile.sub) {
          throw new Error("OIDC profile missing required 'sub' claim")
        }
        if (!profile.email) {
          throw new Error("OIDC profile missing required 'email' claim")
        }
        
        // Map OIDC profile to Spearfish user format
        return {
          id: profile.sub,
          email: profile.email,
          name: profile.name || `${profile.given_name || ''} ${profile.family_name || ''}`.trim(),
          firstName: profile.given_name,
          lastName: profile.family_name,
          userName: profile.preferred_username || profile.email,
          primaryTenantId: profile.tenant_id || profile.primary_tenant_id || 0,
          tenantMemberships: profile.tenant_memberships || [profile.tenant_id || profile.primary_tenant_id || 0],
          roles: profile.roles || [],
          authType: 'oidc',
        }
      }
    },

    /**
     * Google OAuth Provider (Optional)
     * Enables Google authentication if configured
     */
    ...(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET ? [
      Google({
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        profile(profile) {
          // Map Google profile to Spearfish user format
          // Note: This would require additional API call to verify/create user in Spearfish
          return {
            id: profile.sub,
            email: profile.email,
            name: profile.name,
            firstName: profile.given_name,
            lastName: profile.family_name,
            image: profile.picture,
            // These would need to be populated from Spearfish API
            primaryTenantId: 0,
            tenantMemberships: [],
            roles: [],
            authType: 'google',
          }
        }
      })
    ] : []),
  ],

  callbacks: {
    /**
     * JWT Callback - Called whenever a JWT is created, updated, or accessed
     * Adds custom Spearfish user data to the JWT token
     */
    async jwt({ token, user, account, trigger }) {
      // Initial sign in - only store essential data to reduce token size
      if (user && account?.provider === "spearfish-oidc") {
        token.id = user.id
        token.tenantId = user.primaryTenantId || 0
        token.authType = 'oidc'
        
        // Store access token info but not the token itself to reduce size
        if (account.access_token) {
          token.accessTokenExpires = account.expires_at ? account.expires_at * 1000 : Date.now() + 60 * 60 * 1000
        }
        if (account.refresh_token) {
          token.refreshToken = account.refresh_token
        }
      }

      // Handle credentials provider (mock auth)
      if (user && account?.provider === "spearfish-mock") {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.tenantId = user.primaryTenantId || 0
        token.tenantMemberships = user.tenantMemberships || []
        token.roles = user.roles || []
        token.authType = 'credentials'
      }

      // Handle Google OAuth (simplified)
      if (account?.provider === "google" && user) {
        token.tenantId = 0
        token.authType = 'google'
      }

      // Handle token refresh for OIDC
      if (trigger === "update" && token.refreshToken && Date.now() > (token.accessTokenExpires as number)) {
        try {
          const refreshedTokens = await refreshAccessToken(token.refreshToken as string)
          token.accessTokenExpires = Date.now() + refreshedTokens.expires_in * 1000
          if (refreshedTokens.refresh_token) {
            token.refreshToken = refreshedTokens.refresh_token
          }
        } catch (error) {
          console.error("Token refresh failed:", error)
          return { ...token, error: "RefreshAccessTokenError" }
        }
      }

      return token
    },

    /**
     * Session Callback - Called whenever a session is checked
     * Shapes the session object that's returned to the client
     */
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string || session.user.email
        session.user.name = token.name as string || session.user.name
        session.user.primaryTenantId = token.tenantId as number || 0
        session.user.authType = token.authType as string || 'unknown'
        
        // Include additional data for credentials auth
        if (token.authType === 'credentials') {
          session.user.tenantMemberships = token.tenantMemberships as number[] || []
          session.user.roles = token.roles as string[] || []
        }
        
        // Set simplified session data
        session.tenantId = token.tenantId as number || 0
        session.authType = token.authType as string || 'unknown'
      }

      return session
    },
  },

  session: {
    strategy: "jwt" as const,
    maxAge: 12 * 60 * 60, // 12 hours (matching Spearfish sliding expiration)
    updateAge: 60 * 60, // Update session every hour
  },
  
  jwt: {
    // Reduce JWT token size to prevent cookie size issues
    maxAge: 12 * 60 * 60, // 12 hours
  },

  cookies: {
    sessionToken: {
      name: "spearfish.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: env.NODE_ENV === "production",
        domain: env.NODE_ENV === "production" ? ".spearfish.io" : undefined,
      },
    },
    callbackUrl: {
      name: "spearfish.callback-url",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: env.NODE_ENV === "production",
      },
    },
    csrfToken: {
      name: "spearfish.csrf-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: env.NODE_ENV === "production",
      },
    },
  },

  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    signOut: '/auth/signout',
  },
  
  // Theme configuration for Auth.js default pages (if needed)
  theme: {
    colorScheme: "light",
    brandColor: "#007bff",
    logo: "/spearfish-logo.png",
  },

  events: {
    async signIn({ user, account, profile, isNewUser }) {
      try {
        console.log(`User signed in: ${user.email} via ${account?.provider || 'credentials'}${isNewUser ? ' (new user)' : ''}`)
        
        // Log security event for audit trail
        if (account?.provider === 'spearfish-oidc') {
          // These properties are set in the profile() function and may not be available immediately
          const tenantId = (user as any).primaryTenantId || 'unknown'
          const roles = (user as any).roles?.join(',') || 'none'
          console.log(`OIDC sign-in: tenant=${tenantId}, roles=[${roles}]`)
        }
      } catch (error) {
        console.error('SignIn event error:', error)
      }
    },
    async signOut({ session, token }) {
      try {
        console.log(`User signed out: ${session?.user?.email || token?.email}`)
        
        // Revoke tokens at the OIDC provider for complete logout
        if (token?.refreshToken && token?.authType === 'oidc') {
          try {
            await fetch(`${env.NEXT_PUBLIC_API_URL}connect/revoke`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: new URLSearchParams({
                token: token.refreshToken as string,
                client_id: 'platform-web',
              }),
            })
          } catch (error) {
            console.error('Token revocation failed:', error)
          }
        }
      } catch (error) {
        console.error('SignOut event error:', error)
      }
    },
    async session({ session, token }) {
      try {
        // Check for token refresh errors
        if (token?.error === 'RefreshAccessTokenError') {
          console.warn('Session contains refresh error, user may need to re-authenticate')
        }
      } catch (error) {
        console.error('Session event error:', error)
      }
    },
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)