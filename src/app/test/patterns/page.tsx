"use client";

import * as React from "react";
import { 
  Container, 
  Heading, 
  Text, 
  Grid, 
  Flex, 
  Box, 
  Card,
  Separator,
  Badge,
  Button,
  Code,
  Switch
} from "@radix-ui/themes";
import { AppShell } from "@/components/layout/app-shell";
import { CodeExample, ComponentShowcase } from "@/components/test-pages";
import { StateManagementExample } from "@/components/test-pages/interactive-examples";
import { 
  ComponentPlaceholderIcon,
  StackIcon,
  GearIcon,
  FileTextIcon,
  LayersIcon,
  GitHubLogoIcon
} from "@radix-ui/react-icons";

// StateManagementExample imported from interactive-examples.tsx

export default function PatternsPage() {
  const serverComponentCode = `// Server Component (default)
export default async function ServerPage() {
  // Can access server-side resources
  const data = await fetch('https://api.example.com/data');
  
  return (
    <Box>
      <Heading size="6">Server Component</Heading>
      <Text>Rendered on the server</Text>
    </Box>
  );
}`;

  const clientComponentCode = `'use client'
import { useState } from 'react';
import { Button } from '@radix-ui/themes';

// Client Component (interactive)
export function ClientComponent() {
  const [count, setCount] = useState(0);
  
  return (
    <Button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </Button>
  );
}`;

  const stateManagementCode = `import { create } from 'zustand';

// Global state with Zustand
interface AppStore {
  count: number;
  increment: () => void;
  decrement: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));

// Usage in component
function Counter() {
  const { count, increment } = useAppStore();
  
  return (
    <Button onClick={increment}>
      Count: {count}
    </Button>
  );
}`;

  const formHandlingCode = `import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormData = z.infer<typeof schema>;

export function LoginForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    // Handle form submission
    console.log(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <TextField
        {...form.register('email')}
        placeholder="Email"
      />
      {form.formState.errors.email && (
        <Text color="red" size="1">
          {form.formState.errors.email.message}
        </Text>
      )}
      
      <Button type="submit">
        Sign In
      </Button>
    </form>
  );
}`;

  const featureFlagCode = `// Feature flag evaluation (server-side)
import { getFeatureFlags } from '@/lib/feature-flags';

export default async function FeaturePage() {
  const flags = await getFeatureFlags();
  
  return (
    <Box>
      {flags.newDashboard && (
        <NewDashboardComponent />
      )}
      {!flags.newDashboard && (
        <LegacyDashboardComponent />
      )}
    </Box>
  );
}

// Feature flag hook (client-side)
'use client'
import { useFeatureFlag } from '@/hooks/use-feature-flag';

export function ClientFeatureComponent() {
  const isEnabled = useFeatureFlag('newFeature');
  
  if (!isEnabled) return null;
  
  return <NewFeatureComponent />;
}`;

  const errorHandlingCode = `// Error boundary component
'use client'
import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <Card size="3">
          <Text color="red">Something went wrong.</Text>
        </Card>
      );
    }

    return this.props.children;
  }
}

// Usage
<ErrorBoundary>
  <ComponentThatMightError />
</ErrorBoundary>`;

  return (
    <AppShell>
      <Container size="4" p="6">
        {/* Header */}
        <Box mb="8">
          <Heading size="9" mb="3">
            Development Patterns
          </Heading>
          <Text size="4" color="gray" mb="4">
            Architecture patterns and best practices for Platform Web development
          </Text>
          
          <Flex align="center" gap="2" wrap="wrap">
            <Badge variant="soft" color="blue" size="2">
              Next.js 15 Patterns
            </Badge>
            <Badge variant="soft" color="green" size="2">
              React 19 Features
            </Badge>
            <Badge variant="soft" color="purple" size="2">
              TypeScript Best Practices
            </Badge>
            <Badge variant="soft" color="orange" size="2">
              Performance Optimized
            </Badge>
          </Flex>
        </Box>

        {/* Core Architecture Patterns */}
        <Box mb="8">
          <Heading size="6" mb="4">Core Architecture Patterns</Heading>
          
          <Grid columns={{ initial: "1", md: "2" }} gap="4" mb="6">
            <Card size="3">
              <Flex align="start" gap="3">
                <Box style={{ color: "var(--blue-9)" }}>
                  <ComponentPlaceholderIcon style={{ width: "20px", height: "20px" }} />
                </Box>
                <Box>
                  <Heading size="4" mb="2">Server Components First</Heading>
                  <Text size="2" color="gray" mb="3">
                    Default to Server Components for better performance and SEO. 
                    Use Client Components only when interactivity is needed.
                  </Text>
                  <Badge variant="soft" color="blue" size="1">React 19</Badge>
                </Box>
              </Flex>
            </Card>

            <Card size="3">
              <Flex align="start" gap="3">
                <Box style={{ color: "var(--green-9)" }}>
                  <LayersIcon style={{ width: "20px", height: "20px" }} />
                </Box>
                <Box>
                  <Heading size="4" mb="2">Component-Driven Development</Heading>
                  <Text size="2" color="gray" mb="3">
                    Build reusable, composable components. Each component should be 
                    self-contained with clear interfaces and proper TypeScript types.
                  </Text>
                  <Badge variant="soft" color="green" size="1">Design System</Badge>
                </Box>
              </Flex>
            </Card>

            <Card size="3">
              <Flex align="start" gap="3">
                <Box style={{ color: "var(--purple-9)" }}>
                  <GearIcon style={{ width: "20px", height: "20px" }} />
                </Box>
                <Box>
                  <Heading size="4" mb="2">Feature-Flag-Driven</Heading>
                  <Text size="2" color="gray" mb="3">
                    Server-side feature flag evaluation with type-safe definitions. 
                    Enable gradual rollouts and A/B testing capabilities.
                  </Text>
                  <Badge variant="soft" color="purple" size="1">Progressive Deployment</Badge>
                </Box>
              </Flex>
            </Card>

            <Card size="3">
              <Flex align="start" gap="3">
                <Box style={{ color: "var(--orange-9)" }}>
                  <StackIcon style={{ width: "20px", height: "20px" }} />
                </Box>
                <Box>
                  <Heading size="4" mb="2">Type Safety</Heading>
                  <Text size="2" color="gray" mb="3">
                    Strict TypeScript configuration with runtime validation using Zod. 
                    All APIs and data structures are fully typed.
                  </Text>
                  <Badge variant="soft" color="orange" size="1">TypeScript</Badge>
                </Box>
              </Flex>
            </Card>
          </Grid>
        </Box>

        <Separator size="4" mb="8" />

        {/* React Patterns */}
        <Box mb="8">
          <Heading size="6" mb="4">React Component Patterns</Heading>
          
          <Grid columns={{ initial: "1" }} gap="6">
            {/* Server vs Client Components */}
            <ComponentShowcase
              title="Server vs Client Components"
              description="Understanding when to use Server Components vs Client Components in Next.js 15"
              code={serverComponentCode}
              variants={[
                {
                  name: "Server Component Example",
                  component: (
                    <Card size="2" style={{ background: "var(--blue-2)", border: "1px solid var(--blue-6)" }}>
                      <Flex align="center" gap="2">
                        <Badge variant="soft" color="blue" size="1">Server</Badge>
                        <Text size="2" color="blue">
                          Rendered on server, better for SEO and performance
                        </Text>
                      </Flex>
                    </Card>
                  )
                },
                {
                  name: "Client Component Example", 
                  component: (
                    <Card size="2" style={{ background: "var(--green-2)", border: "1px solid var(--green-6)" }}>
                      <Flex align="center" gap="2">
                        <Badge variant="soft" color="green" size="1">Client</Badge>
                        <StateManagementExample />
                      </Flex>
                    </Card>
                  )
                }
              ]}
            >
              <Flex direction="column" gap="3">
                <Text size="2" weight="medium">Key Differences:</Text>
                <Flex direction="column" gap="1">
                  <Text size="1">• Server: Can access databases, APIs, file system</Text>
                  <Text size="1">• Client: Can use hooks, event handlers, browser APIs</Text>
                  <Text size="1">• Server: Better performance and SEO</Text>
                  <Text size="1">• Client: Required for interactivity</Text>
                </Flex>
              </Flex>
            </ComponentShowcase>

            {/* State Management */}
            <ComponentShowcase
              title="State Management Patterns"
              description="Local state with hooks and global state with Zustand"
              code={stateManagementCode}
            >
              <Flex direction="column" gap="3" align="center">
                <Text size="2" weight="medium">State Management Hierarchy:</Text>
                <Flex direction="column" gap="2">
                  <Badge variant="soft" color="blue">1. Local State (useState, useReducer)</Badge>
                  <Badge variant="soft" color="green">2. Context (React.createContext)</Badge>
                  <Badge variant="soft" color="purple">3. Global State (Zustand)</Badge>
                  <Badge variant="soft" color="orange">4. Server State (React Query)</Badge>
                </Flex>
              </Flex>
            </ComponentShowcase>
          </Grid>
        </Box>

        <Separator size="4" mb="8" />

        {/* Form Handling */}
        <Box mb="8">
          <Heading size="6" mb="4">Form Handling Patterns</Heading>
          
          <CodeExample
            title="React Hook Form with Zod Validation"
            description="Type-safe form handling with runtime validation"
            code={formHandlingCode}
          />
        </Box>

        <Separator size="4" mb="8" />

        {/* Feature Flags */}
        <Box mb="8">
          <Heading size="6" mb="4">Feature Flag Patterns</Heading>
          
          <CodeExample
            title="Server-Side Feature Flags"
            description="Type-safe feature flags with server-side evaluation"
            code={featureFlagCode}
          />
        </Box>

        <Separator size="4" mb="8" />

        {/* Error Handling */}
        <Box mb="8">
          <Heading size="6" mb="4">Error Handling Patterns</Heading>
          
          <CodeExample
            title="Error Boundaries and Error Handling"
            description="Comprehensive error handling with React Error Boundaries"
            code={errorHandlingCode}
          />
        </Box>

        {/* Best Practices Summary */}
        <Box mb="8">
          <Heading size="6" mb="4">Best Practices Summary</Heading>
          
          <Grid columns={{ initial: "1", lg: "2" }} gap="4">
            <Card size="3" style={{ background: "var(--green-2)", border: "1px solid var(--green-6)" }}>
              <Heading size="4" color="green" mb="3">✅ Do These</Heading>
              <Flex direction="column" gap="2">
                <Text size="2" color="green">• Prefer Server Components by default</Text>
                <Text size="2" color="green">• Use TypeScript strictly with proper interfaces</Text>
                <Text size="2" color="green">• Implement proper error boundaries</Text>
                <Text size="2" color="green">• Follow Pure Radix UI Themes patterns</Text>
                <Text size="2" color="green">• Write comprehensive tests for all patterns</Text>
                <Text size="2" color="green">• Use feature flags for gradual rollouts</Text>
              </Flex>
            </Card>

            <Card size="3" style={{ background: "var(--red-2)", border: "1px solid var(--red-6)" }}>
              <Heading size="4" color="red" mb="3">❌ Avoid These</Heading>
              <Flex direction="column" gap="2">
                <Text size="2" color="red">• Using Client Components unnecessarily</Text>
                <Text size="2" color="red">• Prop drilling instead of proper state management</Text>
                <Text size="2" color="red">• Missing error handling and loading states</Text>
                <Text size="2" color="red">• Custom CSS classes for component styling</Text>
                <Text size="2" color="red">• Untyped data structures and API responses</Text>
                <Text size="2" color="red">• Hard-coded feature toggles</Text>
              </Flex>
            </Card>
          </Grid>
        </Box>

        {/* Quick Actions */}
        <Box>
          <Heading size="5" mb="4">Implementation Resources</Heading>
          <Flex gap="3" wrap="wrap">
            <Button variant="solid" asChild>
              <a href="/components">Component Library</a>
            </Button>
            <Button variant="soft" asChild>
              <a href="/design-system">Design System</a>
            </Button>
            <Button variant="soft" asChild>
              <a href="/performance">Performance Guide</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/accessibility">Accessibility Standards</a>
            </Button>
          </Flex>
        </Box>
      </Container>
    </AppShell>
  );
}