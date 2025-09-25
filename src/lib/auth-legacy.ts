/**
 * Legacy authentication service for platform-web
 * Integrates with Server/api_server AuthController endpoints
 */

import { logger } from "@/lib/env"

interface LegacyLoginCredentials {
  email: string
  password: string
  twoFactorCode?: string
  twoFactorRecoveryCode?: string
}

interface LegacyUser {
  id: string
  email: string
  name: string
  roles: string[]
  tenantId: number
  tenantName: string
  tenantMemberships: number[]
  version: string
  buildTime: string
}

interface LegacyAuthResponse {
  success: boolean
  user?: LegacyUser
  error?: string
}

class LegacyAuthService {
  constructor() {
    // All API calls now go through platform-web proxy routes
  }

  /**
   * Authenticate with email/password using legacy API
   */
  async login(credentials: LegacyLoginCredentials): Promise<LegacyAuthResponse> {
    try {
      // Use platform-web API route proxy instead of direct backend API call
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
          ...(credentials.twoFactorCode && { twoFactorCode: credentials.twoFactorCode }),
          ...(credentials.twoFactorRecoveryCode && { twoFactorRecoveryCode: credentials.twoFactorRecoveryCode }),
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        logger.error && logger.error("Legacy login failed:", {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
        })
        
        return {
          success: false,
          error: `Authentication failed (${response.status}): ${response.statusText}`,
        }
      }

      // Login successful, now get session information
      const user = await this.getCurrentUser()
      if (!user) {
        return {
          success: false,
          error: "Failed to retrieve user session after login",
        }
      }

      return {
        success: true,
        user,
      }
    } catch (error) {
      logger.error && logger.error("Legacy login error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }
    }
  }

  /**
   * Get current user session from legacy API
   */
  async getCurrentUser(): Promise<LegacyUser | null> {
    try {
      // Use platform-web API route proxy instead of direct backend API call
      const response = await fetch("/api/auth/session", {
        credentials: "include",
      })

      if (!response.ok) {
        logger.error && logger.error("Failed to get current user:", response.status)
        return null
      }

      const data = await response.json()
      return this.mapSessionDataToUser(data)
    } catch (error) {
      logger.error && logger.error("Error getting current user:", error)
      return null
    }
  }

  /**
   * Logout from legacy API
   */
  async logout(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      })

      if (!response.ok) {
        logger.error && logger.error("Legacy logout failed:", response.status)
        return false
      }

      return true
    } catch (error) {
      logger.error && logger.error("Legacy logout error:", error)
      return false
    }
  }

  /**
   * Switch tenant context
   */
  async switchTenant(tenantId: number): Promise<LegacyUser | null> {
    try {
      // Use platform-web API route proxy instead of direct backend API call
      const response = await fetch(`/api/auth/session/tenant/${tenantId}`, {
        method: "PUT",
        credentials: "include",
      })

      if (!response.ok) {
        logger.error && logger.error("Failed to switch tenant:", response.status)
        return null
      }

      const data = await response.json()
      return this.mapSessionDataToUser(data)
    } catch (error) {
      logger.error && logger.error("Error switching tenant:", error)
      return null
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email: string): Promise<boolean> {
    try {
      // Use platform-web API route proxy instead of direct backend API call
      const response = await fetch("/api/auth/password/resetemail", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      return response.ok
    } catch (error) {
      logger.error && logger.error("Error sending password reset email:", error)
      return false
    }
  }

  /**
   * Map legacy session data to user object
   */
  private mapSessionDataToUser(data: any): LegacyUser {
    return {
      id: data.userId || data.id,
      email: data.email,
      name: data.name || data.fullName,
      roles: data.roles || [],
      tenantId: data.tenantId,
      tenantName: data.tenantName,
      tenantMemberships: data.tenantMemberships || [],
      version: data.version || "unknown",
      buildTime: data.buildTime || "unknown",
    }
  }
}

// Export singleton instance
export const legacyAuthService = new LegacyAuthService()
export type { LegacyLoginCredentials, LegacyUser, LegacyAuthResponse }
