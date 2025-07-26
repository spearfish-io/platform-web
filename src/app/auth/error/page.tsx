import { Metadata } from "next"
import { Suspense } from "react"
import { AuthErrorDisplay } from "@/components/auth/auth-error"
import { Card, Heading, Text, Flex, Box } from "@radix-ui/themes"

export const metadata: Metadata = {
  title: "Authentication Error - Platform Web",
  description: "Authentication error occurred",
}

export default function AuthErrorPage() {
  return (
    <Box 
      style={{ 
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--gray-1)"
      }}
    >
      <Card size="4" style={{ width: "100%", maxWidth: "400px" }}>
        <Flex direction="column" gap="6" align="center">
          <Flex direction="column" gap="2" align="center">
            <Heading size="6" weight="bold" color="red">
              Authentication Error
            </Heading>
            <Text size="2" color="gray">
              There was a problem signing you in
            </Text>
          </Flex>

          <Suspense fallback={<div>Loading...</div>}>
            <AuthErrorDisplay />
          </Suspense>
        </Flex>
      </Card>
    </Box>
  )
}