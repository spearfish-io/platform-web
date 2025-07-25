import * as React from "react";
import { Card, Flex, Text, Box } from "@radix-ui/themes";
import { TriangleUpIcon, TriangleDownIcon } from "@radix-ui/react-icons";
import type { DashboardMetric } from "@/types";

interface MetricCardProps {
  metric: DashboardMetric;
}

export function MetricCard({ metric }: MetricCardProps) {
  const { title, value, change, icon: Icon } = metric;

  return (
    <Card 
      size="3" 
      style={{ transition: "box-shadow 0.2s ease-in-out" }}
      data-testid="metric-card"
    >
      <Flex align="center" justify="between" mb="2">
        <Text size="2" weight="medium" color="gray">
          {title}
        </Text>
        {Icon && (
          <Box style={{ width: "16px", height: "16px", color: "var(--gray-9)" }}>
            <Icon />
          </Box>
        )}
      </Flex>
      
      <Text size="6" weight="bold" mb="2">
        {typeof value === "number" ? value.toLocaleString() : value}
      </Text>
      
      {change && (
        <Flex align="center" gap="2">
          {change.type === "increase" ? (
            <Box style={{ width: "12px", height: "12px", color: "var(--green-9)" }}>
              <TriangleUpIcon />
            </Box>
          ) : (
            <Box style={{ width: "12px", height: "12px", color: "var(--red-9)" }}>
              <TriangleDownIcon />
            </Box>
          )}
          <Box 
            style={{ 
              display: "inline-flex", 
              alignItems: "center", 
              padding: "2px 8px", 
              borderRadius: "4px",
              background: change.type === "increase" ? "var(--green-3)" : "var(--red-3)",
              color: change.type === "increase" ? "var(--green-11)" : "var(--red-11)"
            }}
          >
            <Text size="1" weight="medium">
              {change.value > 0 ? "+" : ""}{change.value}%
            </Text>
          </Box>
          <Text size="1" color="gray">
            from last month
          </Text>
        </Flex>
      )}
    </Card>
  );
}