import { Metadata } from "next"
import { Suspense } from "react"
import { AuthModeRouter, AuthLoadingState } from "@/components/auth"
import { Box } from "@radix-ui/themes"

export const metadata: Metadata = {
  title: "Sign In - Platform Web",
  description: "Sign in to your Spearfish account to access enterprise analytics and conversation intelligence tools",
  keywords: ["spearfish", "login", "authentication", "enterprise", "conversation intelligence"],
  robots: "noindex, nofollow", // Don't index login pages
}

/**
 * Sign In Page - Modern Authentication Router
 * 
 * Uses the new AuthModeRouter to support multiple authentication modes:
 * - OAuth/OIDC for modern secure authentication
 * - Legacy credentials for backward compatibility  
 * - Mock authentication for development
 * 
 * Implements enterprise standards:
 * - WCAG AA accessibility compliance
 * - Pure Radix UI Themes styling
 * - Security best practices
 * - Comprehensive error handling
 */
export default function SignInPage() {
  return (
    <main
      id="main-content"
      style={{ 
        minHeight: "100vh",
        background: "var(--gray-1)"
      }}
    >
      <Suspense 
        fallback={
          <AuthLoadingState
            message="Loading authentication..."
            description="Preparing sign-in options for your account"
            variant="overlay"
            size="3"
          />
        }
      >
        <AuthModeRouter 
          callbackUrl="/analytics"
          showDebug={process.env.NODE_ENV === 'development'}
        />
      </Suspense>

      {/* Accessibility Skip Link */}
      <a 
        href="#main-content"
        className="skip-link"
      >
        Skip to main content
      </a>
    </main>
  )
}