import type { Story } from "@ladle/react"
import { MetricCard } from "./metric-card"
import { TrendingUp, TrendingDown, BarChart3, PieChart } from "lucide-react"

/**
 * MetricCard Component Stories - Simplified
 * 
 * Demonstrates MetricCard with correct prop structure
 */

export default {
  title: "Dashboard/MetricCard",
  component: MetricCard,
}

/**
 * Basic MetricCard Examples
 */
export const BasicExamples: Story = () => (
  <div style={{ 
    display: "grid", 
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
    gap: "var(--space-4)",
    maxWidth: "900px"
  }}>
    <MetricCard
      metric={{
        id: "1",
        title: "Total Revenue",
        value: "$45,678",
        change: {
          value: 8.3,
          type: "increase"
        },
        icon: TrendingUp
      }}
    />
    
    <MetricCard
      metric={{
        id: "2",
        title: "Active Users",
        value: "2,456",
        change: {
          value: 15.2,
          type: "increase"
        },
        icon: BarChart3
      }}
    />
    
    <MetricCard
      metric={{
        id: "3",
        title: "Bounce Rate",
        value: "45.2%",
        change: {
          value: -3.1,
          type: "decrease"
        },
        icon: TrendingDown
      }}
    />
  </div>
)

/**
 * Without Change Indicators
 */
export const WithoutChange: Story = () => (
  <div style={{ 
    display: "grid", 
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
    gap: "var(--space-4)",
    maxWidth: "600px"
  }}>
    <MetricCard
      metric={{
        id: "4",
        title: "Total Users",
        value: "12,847",
        icon: BarChart3
      }}
    />
    
    <MetricCard
      metric={{
        id: "5",
        title: "Success Rate",
        value: "98.5%",
        icon: PieChart
      }}
    />
  </div>
)

/**
 * Large Numbers
 */
export const LargeNumbers: Story = () => (
  <MetricCard
    metric={{
      id: "6",
      title: "Total Transactions",
      value: 1234567,
      change: {
        value: 12.4,
        type: "increase"
      },
      icon: TrendingUp
    }}
  />
)