import type { GlobalProvider } from "@ladle/react"
import { Theme } from "@radix-ui/themes"
import "@radix-ui/themes/styles.css"
import "../src/app/globals.css"

/**
 * Global Provider for Ladle Stories
 * 
 * Wraps all stories with necessary providers to match the
 * actual application environment including Radix UI Themes.
 */
export const Provider: GlobalProvider = ({ children, globalTypes }) => {
  // Get theme from global controls (if implemented)
  const theme = globalTypes?.theme || 'light'
  
  return (
    <Theme
      accentColor="blue"
      grayColor="slate"
      radius="medium"
      scaling="100%"
      appearance={theme === 'dark' ? 'dark' : 'light'}
      style={{
        minHeight: '100vh',
        padding: 'var(--space-4)',
        background: 'var(--color-background)',
      }}
    >
      {children}
    </Theme>
  )
}

/**
 * Global Types for Ladle Controls
 * 
 * Defines global controls that appear in all stories,
 * allowing users to switch themes and other global settings.
 */
export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'light',
    toolbar: {
      icon: 'circlehollow',
      items: [
        { value: 'light', title: 'Light Theme' },
        { value: 'dark', title: 'Dark Theme' },
      ],
    },
  },
}