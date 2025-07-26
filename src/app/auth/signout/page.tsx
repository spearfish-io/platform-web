import { Metadata } from "next"
import { SignOutButton } from "@/components/auth/signout-button"
import { Card, Heading, Text, Flex, Box } from "@radix-ui/themes"

export const metadata: Metadata = {
  title: "Sign Out - Platform Web",
  description: "Sign out of your Spearfish account",
}

export default function SignOutPage() {
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
            <Heading size="6" weight="bold">
              Sign Out
            </Heading>
            <Text size="2" color="gray">
              Are you sure you want to sign out?
            </Text>
          </Flex>

          <SignOutButton />
        </Flex>
      </Card>
    </Box>
  )
}