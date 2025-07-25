"use client";

import * as React from "react";
import { Box, Text } from "@radix-ui/themes";
import { 
  DashboardIcon, 
  PersonIcon, 
  GearIcon, 
  FileTextIcon,
  BarChartIcon 
} from "@radix-ui/react-icons";
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
    icon: DashboardIcon,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChartIcon,
  },
  {
    title: "Documents",
    href: "/documents",
    icon: FileTextIcon,
  },
  {
    title: "Users",
    href: "/users",
    icon: PersonIcon,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: GearIcon,
  },
];

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();

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
            </nav>
          </Box>
        </aside>
      </Box>
    </>
  );
}