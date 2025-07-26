"use client";

import * as React from "react";
import { Button, Flex, Text, Box } from "@radix-ui/themes";
import { MoonIcon, SunIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { UserInfo } from "@/components/auth/user-info";

interface HeaderProps {
  onMenuToggle?: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const [isDark, setIsDark] = React.useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    // In a real app, this would update the theme context
    document.documentElement.classList.toggle("dark");
  };

  return (
    <Box 
      asChild
      style={{ 
        borderBottom: "1px solid var(--gray-6)",
        background: "var(--color-background)",
        position: "sticky",
        top: 0,
        zIndex: 50
      }}
    >
      <header data-testid="header">
        <Flex align="center" justify="between" p="4" style={{ height: "64px" }} data-testid="nav-menu">
          <Flex align="center" gap="3">
            <Button
              variant="ghost"
              size="2"
              style={{ display: "none" }}
              onClick={onMenuToggle}
              aria-label="Toggle navigation menu"
              aria-expanded="false"
            >
              <HamburgerMenuIcon />
            </Button>
            <Box asChild data-testid="nav-logo">
              <Link href="/" style={{ textDecoration: "none" }}>
                <Text size="5" weight="bold" color="blue">
                  Platform Web
                </Text>
              </Link>
            </Box>
          </Flex>

          <Flex align="center" gap="2">
            <Button
              variant="ghost"
              size="2"
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? (
                <SunIcon aria-hidden="true" />
              ) : (
                <MoonIcon aria-hidden="true" />
              )}
            </Button>
            <UserInfo />
          </Flex>
        </Flex>
      </header>
    </Box>
  );
}