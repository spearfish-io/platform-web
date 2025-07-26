"use client"

import { useState } from "react"
import { signOut } from "next-auth/react"
import { Button, Flex } from "@radix-ui/themes"
import Link from "next/link"

export function SignOutButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      await signOut({ 
        callbackUrl: "/auth/signin",
        redirect: true 
      })
    } catch (error) {
      console.error("Sign out error:", error)
      setIsLoading(false)
    }
  }

  return (
    <Flex gap="3" justify="center">
      <Button 
        onClick={handleSignOut}
        disabled={isLoading}
        color="red"
        size="3"
      >
        {isLoading ? "Signing out..." : "Sign Out"}
      </Button>
      
      <Button asChild variant="soft" size="3">
        <Link href="/">
          Cancel
        </Link>
      </Button>
    </Flex>
  )
}