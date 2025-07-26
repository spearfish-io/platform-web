import type { Story } from "@ladle/react"
import { Button } from "./button"
import { PlusIcon, UpdateIcon, CheckIcon, CrossIcon } from "@radix-ui/react-icons"

/**
 * Button Component Stories
 * 
 * Demonstrates all variants and states of the Button component
 * for design system documentation and testing.
 */

// Default export defines the component and metadata
export default {
  title: "UI Components/Button",
  component: Button,
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["solid", "soft", "outline", "ghost"],
      defaultValue: "solid",
    },
    color: {
      control: { type: "select" },
      options: ["blue", "red", "green", "yellow", "purple", "gray"],
      defaultValue: "blue",
    },
    size: {
      control: { type: "select" },
      options: ["1", "2", "3", "4"],
      defaultValue: "2",
    },
    radius: {
      control: { type: "select" },
      options: ["none", "small", "medium", "large", "full"],
      defaultValue: "medium",
    },
    disabled: {
      control: { type: "boolean" },
      defaultValue: false,
    },
    loading: {
      control: { type: "boolean" },
      defaultValue: false,
    },
  },
}

/**
 * Default Button Story
 */
export const Default: Story = (args) => (
  <Button {...args}>
    Click me
  </Button>
)

Default.args = {
  variant: "solid",
  color: "blue",
  size: "2",
}

/**
 * Button Variants
 */
export const Variants: Story = () => (
  <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
    <Button variant="solid">Solid</Button>
    <Button variant="soft">Soft</Button>
    <Button variant="outline">Outline</Button>
    <Button variant="ghost">Ghost</Button>
  </div>
)

/**
 * Button Colors
 */
export const Colors: Story = () => (
  <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center", flexWrap: "wrap" }}>
    <Button color="blue">Blue</Button>
    <Button color="red">Red</Button>
    <Button color="green">Green</Button>
    <Button color="yellow">Yellow</Button>
    <Button color="purple">Purple</Button>
    <Button color="gray">Gray</Button>
  </div>
)

/**
 * Button Sizes
 */
export const Sizes: Story = () => (
  <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
    <Button size="1">Size 1</Button>
    <Button size="2">Size 2</Button>
    <Button size="3">Size 3</Button>
    <Button size="4">Size 4</Button>
  </div>
)

/**
 * Button with Icons
 */
export const WithIcons: Story = () => (
  <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center", flexWrap: "wrap" }}>
    <Button>
      <PlusIcon />
      Add Item
    </Button>
    <Button variant="soft" color="green">
      <CheckIcon />
      Success
    </Button>
    <Button variant="soft" color="red">
      <CrossIcon />
      Cancel
    </Button>
    <Button variant="outline">
      <UpdateIcon />
      Refresh
    </Button>
  </div>
)

/**
 * Loading States
 */
export const LoadingStates: Story = () => (
  <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
    <Button loading>
      Loading...
    </Button>
    <Button loading variant="soft">
      Soft Loading
    </Button>
    <Button loading variant="outline">
      Outline Loading
    </Button>
  </div>
)

/**
 * Disabled States
 */
export const DisabledStates: Story = () => (
  <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
    <Button disabled>
      Disabled Solid
    </Button>
    <Button disabled variant="soft">
      Disabled Soft
    </Button>
    <Button disabled variant="outline">
      Disabled Outline
    </Button>
    <Button disabled variant="ghost">
      Disabled Ghost
    </Button>
  </div>
)

/**
 * Interactive Example
 */
export const Interactive: Story = (args) => {
  const handleClick = () => {
    alert("Button clicked!")
  }

  return (
    <Button onClick={handleClick} {...args}>
      {args.children || "Click me!"}
    </Button>
  )
}

Interactive.args = {
  variant: "solid",
  color: "blue",
  size: "3",
  children: "Interactive Button",
}

/**
 * Button Group Example
 */
export const ButtonGroup: Story = () => (
  <div style={{ display: "flex", gap: "var(--space-2)" }}>
    <Button variant="outline" size="2">
      Cancel
    </Button>
    <Button variant="soft" size="2">
      Save Draft
    </Button>
    <Button variant="solid" size="2">
      Publish
    </Button>
  </div>
)