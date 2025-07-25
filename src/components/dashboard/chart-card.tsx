"use client";

import * as React from "react";
import { Card, Flex, Text, Box, Heading } from "@radix-ui/themes";

interface ChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function ChartCard({ title, description, children }: ChartCardProps) {
  return (
    <Card size="3" style={{ transition: "box-shadow 0.2s ease-in-out" }}>
      <Box mb="4">
        <Heading size="4" weight="bold" mb="1">
          {title}
        </Heading>
        {description && (
          <Text size="2" color="gray">
            {description}
          </Text>
        )}
      </Box>
      
      <Box 
        style={{ 
          height: "256px", 
          width: "100%", 
          background: "linear-gradient(135deg, var(--blue-2), var(--indigo-3))",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Flex direction="column" align="center" gap="3">
          <Box 
            style={{ 
              width: "64px", 
              height: "64px", 
              background: "var(--blue-4)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <svg
              style={{ width: "32px", height: "32px", color: "var(--blue-9)" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </Box>
          <Flex direction="column" align="center" gap="1">
            <Text size="2" color="gray">
              Chart visualization placeholder
            </Text>
            <Text size="1" style={{ color: "var(--gray-10)" }}>
              Integrate with your preferred charting library
            </Text>
          </Flex>
        </Flex>
      </Box>
      
      {children}
    </Card>
  );
}