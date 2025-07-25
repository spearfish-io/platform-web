"use client";

import * as React from "react";
import { Box, Flex } from "@radix-ui/themes";
import { Header } from "./header";
import { Sidebar } from "./sidebar";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <Box style={{ minHeight: "100vh", background: "var(--gray-2)" }}>
      <Header onMenuToggle={toggleSidebar} />
      
      <Flex style={{ height: "calc(100vh - 64px)" }}>
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={closeSidebar}
        />
        
        <Box 
          asChild 
          style={{ 
            flex: 1, 
            overflow: "auto",
          }}
          role="main"
          id="main-content"
        >
          <main>
            {children}
          </main>
        </Box>
      </Flex>
    </Box>
  );
}