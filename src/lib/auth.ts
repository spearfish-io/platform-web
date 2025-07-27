import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { env } from "@/lib/env"
import { getAuthMode } from "@/lib/auth-mode"
import type { SpearfishAuthResponse, SpearfishCredentials, SpearfishUser } from "@/types/auth"

/**
 * Auth.js Configuration for Spearfish Platform
 * 
 * Integrates with the existing Spearfish authentication API while providing
 * modern session management and route protection for the Next.js frontend.
 */
export const authConfig = {
  debug: env.NODE_ENV === "development",
  trustHost: true,
  providers: [
    /**
     * Custom Spearfish Credentials Provider
     * Authenticates against the Spearfish platform API
     */
    Credentials({
      id: "spearfish",
      name: "Spearfish",
      credentials: {
        email: { 
          label: "Email", 
          type: "email",
          placeholder: "your.email@company.com"
        },
        password: { 
          label: "Password", 
          type: "password" 
        }
      },
      async authorize(credentials): Promise<SpearfishUser | null> {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const authPayload: SpearfishCredentials = {
            email: credentials.email as string,
            password: credentials.password as string,
          }

          // Authenticate through our local API route (matches portal-spearfish pattern)
          const apiUrl = `${env.NEXT_PUBLIC_APP_URL}/api/auth/login?useCookies=true`
          console.log('🔥 Attempting authentication to:', apiUrl)
          console.log('🔥 Auth payload:', { email: authPayload.email, hasPassword: !!authPayload.password })
          
          const response = await fetch(apiUrl, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(authPayload),
          })

          console.log('🔥 API Response status:', response.status, response.statusText)
          
          if (!response.ok) {
            // Try to get more detailed error information
            const errorText = await response.text()
            console.error('🔥 Spearfish authentication failed:', {
              status: response.status,
              statusText: response.statusText,
              url: apiUrl,
              errorBody: errorText
            })
            return null
          }

          const authResult: SpearfishAuthResponse = await response.json()

          if (!authResult.success || !authResult.user) {
            console.error('Spearfish authentication failed:', authResult.error || authResult.message)
            return null
          }

          // Map Spearfish user to Auth.js user format
          const user: SpearfishUser = {
            id: authResult.user.id,
            email: authResult.user.email,
            name: authResult.user.fullName,
            firstName: authResult.user.firstName,
            lastName: authResult.user.lastName,
            userName: authResult.user.userName,
            primaryTenantId: authResult.user.primaryTenantId,
            tenantMemberships: authResult.user.tenantMemberships || [authResult.user.primaryTenantId],
            roles: authResult.user.roles || [],
            authType: authResult.user.authType || 'credentials',
          }

          return user
        } catch (error) {
          console.error('Error during Spearfish authentication:', error)
          return null
        }
      }
    }),

    /**
     * Spearfish OAuth Provider (Modern OAuth 2.0)
     * Uses the proper OAuth 2.0 endpoints from the Identity API
     */
    ...(getAuthMode() === 'oauth' ? [{
      id: "spearfish-oauth",
      name: "Spearfish OAuth",
      type: "oauth" as const,
      clientId: "platform-web-dev", // Pre-configured client in Identity API
      clientSecret: undefined, // Public client (PKCE)
      issuer: env.NEXT_PUBLIC_API_URL.replace(/\/$/, ''), // Remove trailing slash
      wellKnown: `${env.NEXT_PUBLIC_API_URL}.well-known/openid-configuration`,
      authorization: {
        params: {
          scope: "openid profile email tenant:read user:read",
          response_type: "code",
          code_challenge_method: "S256", // PKCE
        }
      },
      checks: ["pkce", "state"],
      profile(profile: any) {
        // Map OAuth profile to Spearfish user format
        return {
          id: profile.sub,
          email: profile.email,
          name: profile.name,
          firstName: profile.given_name,
          lastName: profile.family_name,
          userName: profile.preferred_username,
          primaryTenantId: profile.tenant_id || profile.primary_tenant_id,
          tenantMemberships: profile.tenant_memberships || [profile.tenant_id || profile.primary_tenant_id],
          roles: profile.roles || [],
          authType: 'oauth',
        }
      }
    }] : []),

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
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        token.id = user.id
        token.tenantId = user.primaryTenantId
        token.roles = user.roles || []
        token.tenantMemberships = user.tenantMemberships || []
        token.authType = user.authType
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.userName = user.userName
      }

      // Handle Spearfish OAuth
      if (account?.provider === "spearfish-oauth" && user) {
        token.id = user.id
        token.tenantId = user.primaryTenantId
        token.roles = user.roles || []
        token.tenantMemberships = user.tenantMemberships || []
        token.authType = 'oauth'
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.userName = user.userName
      }

      // Handle Google OAuth
      if (account?.provider === "google" && user) {
        // TODO: Verify Google user with Spearfish API and get tenant/role information
        // For now, set defaults
        token.tenantId = 0
        token.roles = []
        token.tenantMemberships = []
        token.authType = 'google'
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
        session.user.firstName = token.firstName as string
        session.user.lastName = token.lastName as string
        session.user.userName = token.userName as string
        session.user.primaryTenantId = token.tenantId as number
        session.user.tenantMemberships = token.tenantMemberships as number[]
        session.user.roles = token.roles as string[]
        session.user.authType = token.authType as string
        
        // Add convenience properties to session
        session.tenantId = token.tenantId as number
        session.roles = token.roles as string[]
        session.tenantMemberships = token.tenantMemberships as number[]
        session.authType = token.authType as string
      }

      return session
    },
  },

  session: {
    strategy: "jwt" as const,
    maxAge: 12 * 60 * 60, // 12 hours (matching Spearfish sliding expiration)
  },

  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    signOut: '/auth/signout',
  },

  events: {
    async signIn({ user, account, profile }) {
      console.log(`User signed in: ${user.email} via ${account?.provider || 'credentials'}`)
    },
    async signOut({ session, token }) {
      console.log(`User signed out: ${session?.user?.email || token?.email}`)
    },
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)