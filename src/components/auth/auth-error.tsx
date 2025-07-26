"use client"

import { useSearchParams } from "next/navigation"
import { Button, Flex, Text, Callout } from "@radix-ui/themes"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import Link from "next/link"

const errorMessages: Record<string, string> = {
  Configuration: "There is a problem with the server configuration.",
  AccessDenied: "You do not have permission to sign in.",
  Verification: "The verification token has expired or has already been used.",
  Default: "An error occurred during authentication.",
  CredentialsSignin: "Invalid email or password.",
  EmailSignin: "Check your email for a sign in link.",
  OAuthSignin: "Error signing in with OAuth provider.",
  OAuthCallback: "Error in OAuth callback.",
  OAuthCreateAccount: "Could not create OAuth account.",
  EmailCreateAccount: "Could not create email account.",
  Callback: "Error in callback.",
  OAuthAccountNotLinked: "Account is already linked to another user.",
  SessionRequired: "Please sign in to access this page.",
}

export function AuthErrorDisplay() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  
  const errorMessage = error ? errorMessages[error] || errorMessages.Default : errorMessages.Default

  return (
    <Flex direction="column" gap="4" align="center" style={{ width: "100%" }}>
      <Callout.Root color="red" style={{ width: "100%" }}>
        <Callout.Icon>
          <ExclamationTriangleIcon />
        </Callout.Icon>
        <Callout.Text>
          {errorMessage}
        </Callout.Text>
      </Callout.Root>

      {error && (
        <Text size="1" color="gray" align="center">
          Error code: {error}
        </Text>
      )}

      <Flex gap="3" justify="center">
        <Button asChild variant="soft">
          <Link href="/auth/signin">
            Try Again
          </Link>
        </Button>
        
        <Button asChild variant="outline">
          <Link href="/">
            Go Home
          </Link>
        </Button>
      </Flex>
    </Flex>
  )
}