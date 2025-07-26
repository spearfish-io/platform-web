import type { Story } from "@ladle/react"
import { LoginForm, LoginFormSkeleton } from "./login-form"
import { AuthErrorBoundary } from "./auth-error-boundary"
import { Card, Box, Flex, Heading, Text } from "@radix-ui/themes"
import { useState } from "react"

/**
 * Login Form Component Stories
 * 
 * Comprehensive documentation and testing of login form components
 * with all variants, states, and accessibility features.
 */

export default {
  title: "Authentication/LoginForm",
  component: LoginForm,
  argTypes: {
    enableRememberMe: {
      control: { type: "boolean" },
      defaultValue: true,
    },
    title: {
      control: { type: "text" },
      defaultValue: "Sign in to your account",
    },
  },
}

/**
 * Default Login Form
 */
export const Default: Story = (args) => (
  <Box style={{ maxWidth: "420px", margin: "0 auto", padding: "var(--space-4)" }}>
    <Card size="4">
      <Flex direction="column" gap="6">
        <Flex direction="column" gap="2" align="center">
          <Heading size="6" weight="bold">
            Welcome to Spearfish
          </Heading>
          <Text size="3" color="gray">
            Sign in to access your platform
          </Text>
        </Flex>
        
        <LoginForm {...args} />
      </Flex>
    </Card>
  </Box>
)

Default.args = {
  enableRememberMe: true,
  title: "Sign in to your account",
}

/**
 * Loading State
 */
export const LoadingState: Story = () => (
  <Box style={{ maxWidth: "420px", margin: "0 auto", padding: "var(--space-4)" }}>
    <Card size="4">
      <Flex direction="column" gap="6">
        <Flex direction="column" gap="2" align="center">
          <Heading size="6" weight="bold">
            Welcome to Spearfish
          </Heading>
          <Text size="3" color="gray">
            Sign in to access your platform
          </Text>
        </Flex>
        
        <LoginFormSkeleton />
      </Flex>
    </Card>
  </Box>
)

/**
 * Form with Error States
 */
export const WithErrors: Story = () => {
  const [formKey, setFormKey] = useState(0)
  
  return (
    <Box style={{ maxWidth: "420px", margin: "0 auto", padding: "var(--space-4)" }}>
      <Card size="4">
        <Flex direction="column" gap="6">
          <Flex direction="column" gap="2" align="center">
            <Heading size="6" weight="bold">
              Error State Demo
            </Heading>
            <Text size="3" color="gray">
              Try submitting with invalid data
            </Text>
          </Flex>
          
          <LoginForm
            key={formKey}
            enableRememberMe={true}
            onError={(error) => {
              console.log("Demo error:", error)
            }}
          />
          
          <button 
            onClick={() => setFormKey(prev => prev + 1)}
            style={{ 
              padding: "var(--space-2)", 
              background: "var(--gray-3)",
              border: "1px solid var(--gray-6)",
              borderRadius: "var(--radius-2)"
            }}
          >
            Reset Form
          </button>
        </Flex>
      </Card>
    </Box>
  )
}

/**
 * Form without Remember Me
 */
export const WithoutRememberMe: Story = () => (
  <Box style={{ maxWidth: "420px", margin: "0 auto", padding: "var(--space-4)" }}>
    <Card size="4">
      <Flex direction="column" gap="6">
        <Flex direction="column" gap="2" align="center">
          <Heading size="6" weight="bold">
            Simplified Login
          </Heading>
          <Text size="3" color="gray">
            No remember me option
          </Text>
        </Flex>
        
        <LoginForm 
          enableRememberMe={false}
          title="Sign in without remember me"
        />
      </Flex>
    </Card>
  </Box>
)

/**
 * Form with Error Boundary
 */
export const WithErrorBoundary: Story = () => {
  const [shouldError, setShouldError] = useState(false)
  
  const ErrorProneForm = () => {
    if (shouldError) {
      throw new Error("Simulated authentication error for testing")
    }
    return <LoginForm enableRememberMe={true} />
  }
  
  return (
    <Box style={{ maxWidth: "420px", margin: "0 auto", padding: "var(--space-4)" }}>
      <Card size="4">
        <Flex direction="column" gap="6">
          <Flex direction="column" gap="2" align="center">
            <Heading size="6" weight="bold">
              Error Boundary Demo
            </Heading>
            <Text size="3" color="gray">
              Test error recovery
            </Text>
          </Flex>
          
          <button 
            onClick={() => setShouldError(!shouldError)}
            style={{ 
              padding: "var(--space-2)", 
              background: shouldError ? "var(--red-3)" : "var(--green-3)",
              border: "1px solid " + (shouldError ? "var(--red-6)" : "var(--green-6)"),
              borderRadius: "var(--radius-2)",
              marginBottom: "var(--space-4)"
            }}
          >
            {shouldError ? "Fix Error" : "Trigger Error"}
          </button>
          
          <AuthErrorBoundary
            enableErrorReporting={false}
            onError={(error) => console.log("Demo error boundary:", error)}
          >
            <ErrorProneForm />
          </AuthErrorBoundary>
        </Flex>
      </Card>
    </Box>
  )
}

/**
 * Responsive Form Layout
 */
export const ResponsiveLayout: Story = () => (
  <Flex direction="column" gap="6" style={{ padding: "var(--space-4)" }}>
    <Heading size="4" align="center">
      Responsive Login Form Testing
    </Heading>
    
    <Flex gap="4" wrap="wrap" justify="center">
      {/* Mobile Size */}
      <Box style={{ width: "320px" }}>
        <Text size="2" weight="bold" align="center" style={{ marginBottom: "var(--space-2)" }}>
          Mobile (320px)
        </Text>
        <Card size="3">
          <LoginForm enableRememberMe={true} />
        </Card>
      </Box>
      
      {/* Tablet Size */}
      <Box style={{ width: "420px" }}>
        <Text size="2" weight="bold" align="center" style={{ marginBottom: "var(--space-2)" }}>
          Tablet (420px)
        </Text>
        <Card size="4">
          <LoginForm enableRememberMe={true} />
        </Card>
      </Box>
      
      {/* Desktop Size */}
      <Box style={{ width: "500px" }}>
        <Text size="2" weight="bold" align="center" style={{ marginBottom: "var(--space-2)" }}>
          Desktop (500px)
        </Text>
        <Card size="4">
          <LoginForm enableRememberMe={true} />
        </Card>
      </Box>
    </Flex>
  </Flex>
)

/**
 * Accessibility Testing
 */
export const AccessibilityTest: Story = () => (
  <Box style={{ maxWidth: "420px", margin: "0 auto", padding: "var(--space-4)" }}>
    <Card size="4">
      <Flex direction="column" gap="6">
        <Flex direction="column" gap="2" align="center">
          <Heading size="6" weight="bold">
            Accessibility Test
          </Heading>
          <Text size="3" color="gray">
            Test keyboard navigation and screen reader support
          </Text>
        </Flex>
        
        <Box style={{ 
          padding: "var(--space-3)", 
          background: "var(--blue-2)", 
          border: "1px solid var(--blue-6)",
          borderRadius: "var(--radius-2)"
        }}>
          <Text size="2" weight="bold" style={{ marginBottom: "var(--space-2)" }}>
            Accessibility Features:
          </Text>
          <ul style={{ margin: 0, paddingLeft: "var(--space-4)" }}>
            <li><Text size="1">Keyboard navigation (Tab, Enter, Space)</Text></li>
            <li><Text size="1">ARIA labels and descriptions</Text></li>
            <li><Text size="1">Screen reader announcements</Text></li>
            <li><Text size="1">Focus management</Text></li>
            <li><Text size="1">Error announcements</Text></li>
            <li><Text size="1">High contrast support</Text></li>
            <li><Text size="1">Reduced motion support</Text></li>
          </ul>
        </Box>
        
        <LoginForm 
          enableRememberMe={true}
          title="Accessibility optimized login form"
        />
      </Flex>
    </Card>
  </Box>
)

/**
 * Dark Theme
 */
export const DarkTheme: Story = () => (
  <Box 
    style={{ 
      minHeight: "100vh",
      background: "var(--gray-1)",
      padding: "var(--space-4)"
    }}
    data-theme="dark"
  >
    <Box style={{ maxWidth: "420px", margin: "0 auto" }}>
      <Card size="4">
        <Flex direction="column" gap="6">
          <Flex direction="column" gap="2" align="center">
            <Heading size="6" weight="bold">
              Dark Theme Login
            </Heading>
            <Text size="3" color="gray">
              Testing dark mode appearance
            </Text>
          </Flex>
          
          <LoginForm enableRememberMe={true} />
        </Flex>
      </Card>
    </Box>
  </Box>
)

/**
 * Form Validation Demo
 */
export const ValidationDemo: Story = () => (
  <Box style={{ maxWidth: "420px", margin: "0 auto", padding: "var(--space-4)" }}>
    <Card size="4">
      <Flex direction="column" gap="6">
        <Flex direction="column" gap="2" align="center">
          <Heading size="6" weight="bold">
            Validation Demo
          </Heading>
          <Text size="3" color="gray">
            Try different input patterns
          </Text>
        </Flex>
        
        <Box style={{ 
          padding: "var(--space-3)", 
          background: "var(--amber-2)", 
          border: "1px solid var(--amber-6)",
          borderRadius: "var(--radius-2)"
        }}>
          <Text size="2" weight="bold" style={{ marginBottom: "var(--space-2)" }}>
            Test Cases:
          </Text>
          <ul style={{ margin: 0, paddingLeft: "var(--space-4)" }}>
            <li><Text size="1">Invalid email: "test@"</Text></li>
            <li><Text size="1">Short password: "123"</Text></li>
            <li><Text size="1">Weak password: "password"</Text></li>
            <li><Text size="1">Valid: "user@example.com" + "SecureP@ss123"</Text></li>
          </ul>
        </Box>
        
        <LoginForm enableRememberMe={true} />
      </Flex>
    </Card>
  </Box>
)

/**
 * Interactive Demo
 */
export const InteractiveDemo: Story = () => {
  const [logs, setLogs] = useState<string[]>([])
  
  const addLog = (message: string) => {
    setLogs(prev => [...prev.slice(-4), `${new Date().toLocaleTimeString()}: ${message}`])
  }
  
  return (
    <Flex gap="6" style={{ padding: "var(--space-4)" }}>
      {/* Form */}
      <Box style={{ maxWidth: "420px" }}>
        <Card size="4">
          <Flex direction="column" gap="6">
            <Flex direction="column" gap="2" align="center">
              <Heading size="6" weight="bold">
                Interactive Demo
              </Heading>
              <Text size="3" color="gray">
                Watch the event log
              </Text>
            </Flex>
            
            <LoginForm 
              enableRememberMe={true}
              onSuccess={(url) => addLog(`Success: Redirecting to ${url}`)}
              onError={(error) => addLog(`Error: ${error}`)}
            />
          </Flex>
        </Card>
      </Box>
      
      {/* Event Log */}
      <Box style={{ minWidth: "300px" }}>
        <Card size="3">
          <Flex direction="column" gap="3">
            <Heading size="4">Event Log</Heading>
            <Box 
              style={{ 
                minHeight: "200px",
                padding: "var(--space-3)",
                background: "var(--gray-2)",
                borderRadius: "var(--radius-2)",
                fontFamily: "monospace",
                fontSize: "var(--font-size-1)"
              }}
            >
              {logs.length === 0 ? (
                <Text size="1" color="gray">No events yet...</Text>
              ) : (
                logs.map((log, index) => (
                  <div key={index} style={{ marginBottom: "var(--space-1)" }}>
                    <Text size="1">{log}</Text>
                  </div>
                ))
              )}
            </Box>
            <button 
              onClick={() => setLogs([])}
              style={{ 
                padding: "var(--space-1)", 
                background: "var(--gray-3)",
                border: "1px solid var(--gray-6)",
                borderRadius: "var(--radius-2)",
                fontSize: "var(--font-size-1)"
              }}
            >
              Clear Log
            </button>
          </Flex>
        </Card>
      </Box>
    </Flex>
  )
}