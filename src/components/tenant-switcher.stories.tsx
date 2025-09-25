import type { StoryDefault, Story } from "@ladle/react"
import { TenantSwitcher } from "./tenant-switcher"

export default {
  title: "Components/TenantSwitcher",
} satisfies StoryDefault

export const Default: Story = () => (
  <div style={{ padding: "20px" }}>
    <TenantSwitcher />
  </div>
)

// Note: This story requires the TenantProvider context to be available
// In a real application, this would be wrapped by the providers
export const WithMockData: Story = () => (
  <div style={{ padding: "20px", backgroundColor: "var(--gray-2)" }}>
    <div style={{ 
      display: "flex", 
      alignItems: "center", 
      gap: "16px",
      padding: "16px",
      backgroundColor: "var(--color-background)",
      borderRadius: "8px"
    }}>
      <span>Header Layout Example:</span>
      <TenantSwitcher />
    </div>
  </div>
)