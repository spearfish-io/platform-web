"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button, TextField, Flex, Text, Callout } from "@radix-ui/themes"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"

export function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  const urlError = searchParams.get("error")

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    setError(null)

    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password) {
      setError("Please enter both email and password")
      setIsLoading(false)
      return
    }

    try {
      const result = await signIn("spearfish", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid email or password")
      } else if (result?.ok) {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (error) {
      console.error("Sign in error:", error)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form action={handleSubmit}>
      <Flex direction="column" gap="4">
        {/* Display URL-based errors */}
        {urlError && (
          <Callout.Root color="red">
            <Callout.Icon>
              <ExclamationTriangleIcon />
            </Callout.Icon>
            <Callout.Text>
              {urlError === "CredentialsSignin" 
                ? "Invalid email or password" 
                : "Authentication error occurred"}
            </Callout.Text>
          </Callout.Root>
        )}

        {/* Display form errors */}
        {error && (
          <Callout.Root color="red">
            <Callout.Icon>
              <ExclamationTriangleIcon />
            </Callout.Icon>
            <Callout.Text>{error}</Callout.Text>
          </Callout.Root>
        )}

        <Flex direction="column" gap="2">
          <Text size="2" weight="medium">
            Email
          </Text>
          <TextField.Root
            name="email"
            type="email"
            placeholder="your.email@company.com"
            required
            disabled={isLoading}
            size="3"
          />
        </Flex>

        <Flex direction="column" gap="2">
          <Text size="2" weight="medium">
            Password
          </Text>
          <TextField.Root
            name="password"
            type="password"
            placeholder="Enter your password"
            required
            disabled={isLoading}
            size="3"
          />
        </Flex>

        <Button 
          type="submit" 
          size="3" 
          disabled={isLoading}
          style={{ width: "100%", marginTop: "var(--space-2)" }}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>

        <Text size="1" color="gray" align="center">
          Sign in with your Spearfish account credentials
        </Text>
      </Flex>
    </form>
  )
}