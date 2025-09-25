"use client"

import { useState } from "react"
import { Button, Card, Flex, Text, TextField, Callout } from "@radix-ui/themes"
import { EnvelopeClosedIcon, LockClosedIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { useRouter } from "next/navigation"
// Simple console logger for legacy auth
const logger = {
  info: console.log,
  error: console.error,
}

interface LegacySignInFormProps {
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function LegacySignInForm({ onSuccess, onError }: LegacySignInFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Use the platform-web proxy endpoint which will handle the legacy API call
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Authentication failed: ${response.status}`)
      }

      // Success - cookies are automatically set
      logger.info && logger.info("Legacy login successful")
      onSuccess?.()
      
      // Force a page reload to ensure middleware picks up the new cookies
      window.location.href = "/dashboard"
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed"
      logger.error && logger.error("Legacy login error:", err)
      setError(errorMessage)
      onError?.(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card size="3" style={{ maxWidth: "400px", margin: "0 auto" }}>
      <form onSubmit={handleSubmit}>
        <Flex direction="column" gap="4">
          <Text size="6" weight="bold" align="center">
            Sign In
          </Text>
          
          <Text size="2" color="gray" align="center">
            Enter your credentials to access your account
          </Text>

          {error && (
            <Callout.Root color="red" size="1">
              <Callout.Icon>
                <ExclamationTriangleIcon />
              </Callout.Icon>
              <Callout.Text>{error}</Callout.Text>
            </Callout.Root>
          )}

          <Flex direction="column" gap="3">
            <TextField.Root
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
              size="3"
              autoComplete="email"
            >
              <TextField.Slot>
                <EnvelopeClosedIcon />
              </TextField.Slot>
            </TextField.Root>

            <TextField.Root
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isSubmitting}
              size="3"
              autoComplete="current-password"
            >
              <TextField.Slot>
                <LockClosedIcon />
              </TextField.Slot>
            </TextField.Root>
          </Flex>

          <Button 
            type="submit" 
            size="3" 
            disabled={isSubmitting || !email || !password}
            loading={isSubmitting}
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </Button>

          <Text size="1" color="gray" align="center">
            <a href="/forgot-password" style={{ color: "var(--accent-9)" }}>
              Forgot your password?
            </a>
          </Text>
        </Flex>
      </form>
    </Card>
  )
}
