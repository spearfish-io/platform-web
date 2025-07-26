"use client";

import * as React from "react";
import { Box, Text } from "@radix-ui/themes";
import { getTestPagesConfig } from "@/lib/test-pages-config";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  FileText,
  BarChart3,
  Palette,
  Package,
  Layers,
  Rocket,
  Eye,
  Lock,
  FlaskConical
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/types";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Documents",
    href: "/documents",
    icon: FileText,
  },
  {
    title: "Users",
    href: "/users",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

const testPageItems: NavItem[] = [
  {
    title: "Test Suite",
    href: "/test",
    icon: FlaskConical,
  },
  {
    title: "Design System",
    href: "/test/design-system",
    icon: Palette,
  },
  {
    title: "Components",
    href: "/test/components",
    icon: Package,
  },
  {
    title: "Patterns",
    href: "/test/patterns",
    icon: Layers,
  },
  {
    title: "Performance",
    href: "/test/performance",
    icon: Rocket,
  },
  {
    title: "Accessibility",
    href: "/test/accessibility",
    icon: Eye,
  },
  {
    title: "Auth Demo",
    href: "/test/auth-demo",
    icon: Lock,
  },
];

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();
  const testPagesConfig = getTestPagesConfig();

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <Box
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.2)",
            zIndex: 40,
            display: "none" // Hidden for now since we're not implementing mobile
          }}
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <Box
        asChild
        style={{
          position: "relative",
          height: "100%",
          width: "256px",
          background: "var(--color-background)",
          borderRight: "1px solid var(--gray-6)",
          transition: "transform 0.2s ease-in-out"
        }}
        role="navigation"
        aria-label="Main navigation"
      >
        <aside data-testid="sidebar">
          <Box p="4">
            <Text size="6" weight="bold" color="blue">
              Platform Web
            </Text>
          </Box>
          
          <Box asChild p="4" pt="2">
            <nav>
              {/* Main Navigation */}
              <Box asChild style={{ listStyle: "none", margin: 0, padding: 0 }}>
                <ul>
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    
                    return (
                      <Box asChild key={item.href} mb="1">
                        <li>
                          <Box asChild>
                            <Link
                              href={item.href}
                              onClick={onClose}
                              data-testid={`nav-${item.title.toLowerCase()}`}
                              data-active={isActive}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                padding: "8px 12px",
                                borderRadius: "6px",
                                fontSize: "14px",
                                fontWeight: "500",
                                textDecoration: "none",
                                transition: "all 0.2s ease",
                                background: isActive ? "var(--blue-3)" : "transparent",
                                color: isActive ? "var(--blue-11)" : "var(--gray-11)"
                              }}
                              aria-current={isActive ? "page" : undefined}
                            >
                              {Icon && (
                                <Box style={{ width: "18px", height: "18px" }} aria-hidden="true">
                                  <Icon />
                                </Box>
                              )}
                              {item.title}
                            </Link>
                          </Box>
                        </li>
                      </Box>
                    );
                  })}
                </ul>
              </Box>
              
              {/* Test Pages Section - Only show in local development */}
              {testPagesConfig.showInNavigation && (
                <Box mt="6">
                  <Text size="1" weight="medium" color="gray" mb="2" style={{ padding: "0 12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Design System
                  </Text>
                  <Box asChild style={{ listStyle: "none", margin: 0, padding: 0 }}>
                    <ul>
                      {testPageItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        
                        return (
                          <Box asChild key={item.href} mb="1">
                            <li>
                              <Box asChild>
                                <Link
                                  href={item.href}
                                  onClick={onClose}
                                  data-testid={`nav-${item.title.toLowerCase().replace(' ', '-')}`}
                                  data-active={isActive}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                    padding: "8px 12px",
                                    borderRadius: "6px",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    textDecoration: "none",
                                    transition: "all 0.2s ease",
                                    background: isActive ? "var(--purple-3)" : "transparent",
                                    color: isActive ? "var(--purple-11)" : "var(--gray-11)"
                                  }}
                                  aria-current={isActive ? "page" : undefined}
                                >
                                  {Icon && (
                                    <Box style={{ width: "18px", height: "18px" }} aria-hidden="true">
                                      <Icon />
                                    </Box>
                                  )}
                                  {item.title}
                                </Link>
                              </Box>
                            </li>
                          </Box>
                        );
                      })}
                    </ul>
                  </Box>
                </Box>
              )}
            </nav>
          </Box>
        </aside>
      </Box>
    </>
  );
}