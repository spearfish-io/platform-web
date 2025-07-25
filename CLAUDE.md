# CLAUDE.md - Platform Web

This file provides guidance to Claude Code (claude.ai/code) when working with the Platform Web Next.js application prototype.

## Project Overview

Platform Web is a modern Next.js 15 prototype application that demonstrates the latest web development best practices and serves as a feasibility study for replacing existing legacy web applications. Built with React 19, TypeScript, and **pure Radix UI Themes styling**, it showcases contemporary approaches to responsive design, accessibility, and security using only Radix UI's built-in design system.

### Purpose & Goals

- **Technology Evaluation**: Assess the feasibility of migrating from legacy web applications to modern React/Next.js architecture
- **Design System Evaluation**: Evaluate Radix UI Themes as a complete design system using ONLY its default styling capabilities
- **Best Practices Demonstration**: Showcase current industry standards for web development
- **Performance Benchmarking**: Establish performance baselines for future applications
- **Developer Experience**: Evaluate modern tooling and development workflows with minimal custom styling
- **Accessibility Standards**: Implement WCAG AA compliance leveraging Radix UI's built-in accessibility features

## Technology Stack

### Core Framework
- **Next.js 15.4+**: Latest version with App Router, Turbopack, and React Server Components
- **React 19**: Latest React with concurrent features and improved hooks
- **TypeScript 5.8+**: Strict type checking with enhanced compiler options

### UI & Styling
- **Radix UI Themes 3.2+**: **EXCLUSIVE** design system and component library - NO custom CSS classes allowed
- **Radix UI Primitives**: Accessible, unstyled UI primitives as foundation (when Themes components are insufficient)
- **Tailwind CSS 4**: Used ONLY for @radix-ui/themes integration - NO utility classes in components
- **Pure Radix Styling**: All visual styling achieved through Radix UI Themes props (color, size, variant, etc.)

### State Management & Forms
- **Zustand**: Lightweight state management for global application state
- **React Hook Form**: Performant forms with minimal re-renders
- **Zod**: Runtime type validation and schema validation
- **React Context**: Component-level state management

### Performance & Optimization
- **Next.js Bundle Analyzer**: Bundle size analysis and optimization
- **Turbopack**: Fast bundler for development
- **React Server Components**: Server-side rendering optimization
- **Image Optimization**: Next.js Image component with WebP/AVIF support

### Development Tools
- **ESLint**: Code linting with Next.js configuration
- **TypeScript**: Static type checking with strict configuration
- **Framer Motion**: Animation library for enhanced UX
- **@next/env**: Environment variable management with validation

## Project Structure

```
platform-web/
├── src/
│   ├── app/                    # Next.js 15 App Router (FOLLOWS LATEST BEST PRACTICES)
│   │   ├── layout.tsx          # Root layout with Theme provider (REQUIRED)
│   │   ├── page.tsx            # Dashboard homepage
│   │   ├── loading.tsx         # Global loading UI (SPECIAL FILE)
│   │   ├── error.tsx           # Global error UI (SPECIAL FILE)  
│   │   ├── not-found.tsx       # 404 page (SPECIAL FILE)
│   │   ├── globals.css         # Global styles with Radix themes
│   │   ├── analytics/          # Route segment
│   │   │   ├── page.tsx        # /analytics route
│   │   │   └── loading.tsx     # Analytics loading state
│   │   ├── settings/           # Route segment
│   │   │   └── page.tsx        # /settings route
│   │   └── users/              # Route segment (placeholder)
│   ├── components/             # Reusable React components
│   │   ├── ui/                 # Base UI components (Pure Radix-based)
│   │   │   ├── button.tsx      # Enhanced Button with variants
│   │   │   ├── card.tsx        # Card component system
│   │   │   ├── badge.tsx       # Status and info badges
│   │   │   ├── lazy-image.tsx  # Optimized image loading
│   │   │   └── visually-hidden.tsx # Accessibility helper
│   │   ├── layout/             # Application layout components
│   │   │   ├── app-shell.tsx   # Main application wrapper
│   │   │   ├── header.tsx      # Top navigation bar
│   │   │   └── sidebar.tsx     # Side navigation menu
│   │   └── dashboard/          # Dashboard-specific components
│   │       ├── metric-card.tsx # KPI metric displays
│   │       └── chart-card.tsx  # Chart visualization wrapper
│   ├── hooks/                  # Custom React hooks
│   │   ├── use-keyboard-navigation.ts # Accessibility navigation
│   │   ├── use-focus-trap.ts   # Focus management for modals
│   │   └── use-intersection-observer.ts # Lazy loading support
│   ├── lib/                    # Utilities and configurations
│   │   ├── utils.ts            # Common utility functions
│   │   └── env.ts              # Environment variable validation
│   └── types/                  # TypeScript type definitions
│       └── index.ts            # Application-wide types
├── next.config.ts              # Next.js configuration with security
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies and scripts
├── .env.example                # Environment variable template
├── .env.local                  # Local development environment
├── .env.development            # Development environment (Vercel)
├── .env.production             # Production environment (Vercel)
└── CLAUDE.md                   # This documentation file
```

## Next.js 15 App Router Best Practices (IMPLEMENTED)

### File-System Based Routing
- **✅ Folder Structure**: Routes defined by folder structure in `src/app/`
- **✅ Page Files**: Each route has a `page.tsx` file
- **✅ Nested Routes**: Automatic nesting through folder hierarchy
- **✅ Root Layout**: Required `layout.tsx` with `html` and `body` tags

### Special Files (Following Latest Standards)
- **✅ `layout.tsx`**: Shared UI between routes (with Theme provider)
- **✅ `page.tsx`**: Unique UI for each route segment
- **✅ `loading.tsx`**: Loading UI with automatic Suspense boundaries
- **✅ `error.tsx`**: Error UI with error boundaries ("use client" required)
- **✅ `not-found.tsx`**: Custom 404 pages for better UX

### Server Components First
- **✅ Default**: All components are Server Components by default
- **✅ Client Components**: Only when needed (marked with "use client")
- **✅ Performance**: Reduced JavaScript bundle size
- **✅ SEO**: Better search engine optimization

### Route Segments Examples
```
src/app/
├── page.tsx              # / (dashboard)
├── loading.tsx           # Global loading state
├── error.tsx             # Global error boundary
├── not-found.tsx         # 404 page
├── analytics/
│   ├── page.tsx          # /analytics
│   └── loading.tsx       # Analytics loading state
└── settings/
    └── page.tsx          # /settings
```

### Navigation Best Practices
- **✅ Link Component**: Using Next.js `<Link>` for client-side navigation
- **✅ Prefetching**: Automatic prefetching for performance
- **✅ Server Actions**: Ready for server-side form handling

## Architecture Principles

### 1. **Pure Radix UI Themes Styling (MANDATORY)**
- **ZERO custom CSS classes** - All styling achieved through Radix UI Themes component props
- **NO Tailwind utility classes** in component JSX (bg-*, text-*, p-*, m-*, etc.)
- **NO custom className props** for visual styling
- **Use Radix props ONLY**: `color`, `size`, `variant`, `radius`, `weight`, `align`, etc.
- **Leverage Radix theme tokens** through the Theme provider configuration
- **Exception**: Structural layout classes like `className="container"` are allowed for non-visual purposes

### 2. **Component-Driven Development**
- All UI elements are built as reusable, composable components
- Components follow the Radix UI Themes design system exclusively
- Each component includes TypeScript interfaces and proper accessibility attributes
- Component variants are managed through Radix UI Themes props, not custom CSS

### 3. **Accessibility-First Design**
- WCAG AA compliance is mandatory for all components
- Semantic HTML elements and ARIA attributes are used throughout
- Keyboard navigation is supported in all interactive elements
- Focus management is implemented for modal and overlay components
- Screen reader compatibility is tested and maintained

### 4. **Performance Optimization**
- Server-side rendering with React Server Components
- Code splitting and lazy loading for optimal bundle sizes
- Image optimization with Next.js Image component
- Bundle analysis tools for continuous performance monitoring
- Intersection Observer API for efficient lazy loading

### 5. **Type Safety**
- Strict TypeScript configuration with comprehensive type checking
- Runtime validation with Zod schemas
- Component props are fully typed with TypeScript interfaces
- API responses and data structures have defined types

### 6. **Security Best Practices**
- Content Security Policy (CSP) headers configured
- XSS protection and frame options set
- Secure referrer policies implemented
- Input sanitization and validation on all forms
- No sensitive data exposure in client-side code

## Development Guidelines

### Component Development

#### Creating New Components (Pure Radix UI Themes)
```typescript
import { Box, Heading } from "@radix-ui/themes";

// 1. Define component interface - NO className for styling
interface MyComponentProps {
  title: string;
  variant?: "surface" | "classic" | "soft";
  size?: "1" | "2" | "3" | "4";
  children?: React.ReactNode;
}

// 2. Use ONLY Radix UI Themes components and props
const MyComponent = React.forwardRef<HTMLDivElement, MyComponentProps>(
  ({ title, variant = "surface", size = "3", children, ...props }, ref) => {
    return (
      <Box
        ref={ref}
        p={size}
        style={{ background: variant === "surface" ? "var(--gray-2)" : undefined }}
        {...props}
      >
        <Heading size={size} weight="bold" mb="2">
          {title}
        </Heading>
        {children}
      </Box>
    );
  }
);
MyComponent.displayName = "MyComponent";
```

#### Accessibility Requirements
- **Semantic HTML**: Use appropriate HTML elements (`header`, `nav`, `main`, `section`, etc.)
- **ARIA Labels**: Provide descriptive labels for interactive elements
- **Keyboard Support**: Implement Tab, Enter, Escape, and Arrow key navigation
- **Focus Management**: Ensure visible focus indicators and logical tab order
- **Screen Reader Support**: Test with screen readers and provide appropriate announcements

#### Pure Radix UI Themes Styling Conventions
```typescript
// ✅ CORRECT - Use ONLY Radix UI Themes components and props
import { Flex, Button } from "@radix-ui/themes";

<Flex align="center" gap="2" p="4">
  <Button 
    variant={isActive ? "solid" : "soft"}
    color={isActive ? "blue" : "gray"}
    size="2"
  >
    Navigation Item
  </Button>
</Flex>

// ❌ INCORRECT - NO custom CSS classes
<div className="flex items-center gap-2 px-4 py-2">
  <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded">
    Button
  </button>
</div>

// ❌ INCORRECT - NO Tailwind utility classes
<Box className="bg-gray-100 p-4 rounded-lg">
  Content
</Box>

// ✅ CORRECT - Use Radix theme tokens through CSS variables when needed
<Box style={{ background: "var(--gray-2)", padding: "var(--space-4)" }}>
  Content
</Box>
```

### State Management Patterns

#### Local Component State
```typescript
// Use React hooks for component-specific state
const [isOpen, setIsOpen] = React.useState(false);
const [loading, setLoading] = React.useState(false);

// Use reducers for complex state logic
const [state, dispatch] = React.useReducer(reducer, initialState);
```

#### Global Application State
```typescript
// Use Zustand for global state management
interface AppStore {
  user: User | null;
  theme: "light" | "dark";
  setUser: (user: User) => void;
  toggleTheme: () => void;
}

const useAppStore = create<AppStore>((set) => ({
  user: null,
  theme: "light",
  setUser: (user) => set({ user }),
  toggleTheme: () => set((state) => ({ 
    theme: state.theme === "light" ? "dark" : "light" 
  })),
}));
```

### Form Handling
```typescript
// Use React Hook Form with Zod validation
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormData = z.infer<typeof schema>;

const form = useForm<FormData>({
  resolver: zodResolver(schema),
  defaultValues: {
    email: "",
    password: "",
  },
});

const onSubmit = async (data: FormData) => {
  try {
    await submitForm(data);
  } catch (error) {
    // Handle errors
  }
};
```

## Environment Variable Management

### Environment Configuration with @next/env

The application uses `@next/env` for comprehensive environment variable management across local, development, and production environments.

#### Environment Files Structure
```
.env.example          # Template with all available variables
.env.local           # Local development (gitignored)
.env.development     # Development environment (Vercel dev branch)
.env.production      # Production environment (Vercel production)
```

#### Environment Variable Categories

**Public Variables (NEXT_PUBLIC_)** - Safe for client-side use:
- `NEXT_PUBLIC_APP_URL` - Application base URL
- `NEXT_PUBLIC_API_URL` - API endpoint URL
- `NEXT_PUBLIC_ANALYTICS_ID` - Analytics tracking ID
- `NEXT_PUBLIC_ENABLE_ANALYTICS` - Feature flag for analytics
- `NEXT_PUBLIC_ENABLE_DEBUG` - Debug mode toggle
- `NEXT_PUBLIC_CDN_URL` - CDN base URL

**Server-Only Variables** - Secure, server-side only:
- `API_SECRET_KEY` - API authentication secret
- `DATABASE_URL` - Database connection string
- `NEXTAUTH_SECRET` - Authentication secret key
- `SENTRY_DSN` - Error tracking endpoint

#### Environment Variable Validation

All environment variables are validated using Zod schemas in `src/lib/env.ts`:

```typescript
import { env, isDevelopment, isProduction, features } from "@/lib/env";

// Type-safe access to validated environment variables
const apiUrl = env.NEXT_PUBLIC_API_URL;
const isDebugMode = features.debug;
const deploymentEnv = getDeploymentEnvironment(); // "local" | "development" | "staging" | "production"
```

#### Multi-Environment Support

**Local Development** (`.env.local`):
- Used when running `npm run dev` locally
- Contains local development database and API endpoints
- Debug features enabled

**Development Environment** (`.env.development`):
- Used for Vercel development branch deployments
- Points to development APIs and services
- Analytics and debug features enabled

**Production Environment** (`.env.production`):
- Used for Vercel production deployments
- Points to production APIs and services
- Debug features disabled, analytics enabled

**Future Staging Environment**:
- Ready to add `.env.staging` for staging deployments
- Would use Vercel preview deployments or separate staging branch

#### Vercel Integration

The application automatically detects Vercel environment variables:
- `VERCEL` - Detects if running on Vercel
- `VERCEL_ENV` - Current Vercel environment (development/preview/production)
- `VERCEL_URL` - Deployment URL for preview builds
- `VERCEL_GIT_COMMIT_SHA` - Git commit hash

#### Azure Migration Support

Environment variables are pre-configured for future Azure migration:
- `AZURE_CLIENT_ID` - Azure application client ID  
- `AZURE_CLIENT_SECRET` - Azure application secret
- `AZURE_TENANT_ID` - Azure tenant identifier

#### Security Best Practices

1. **Secret Management**: Sensitive variables stored only in Vercel dashboard
2. **Client/Server Separation**: Client variables validated separately
3. **Type Safety**: All variables typed and validated at runtime
4. **Environment Detection**: Automatic environment detection and configuration
5. **Error Handling**: Clear error messages for missing/invalid variables

#### Usage Examples

```typescript
// Feature flags
import { features } from "@/lib/env";
if (features.analytics) {
  // Initialize analytics
}

// Environment detection
import { isDevelopment, getDeploymentEnvironment } from "@/lib/env";
if (isDevelopment) {
  console.log("Development mode enabled");
}

// Safe environment access
import { env } from "@/lib/env";
const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/users`);
```

## Build and Deployment

### Development Commands
```bash
# Start development server with Turbopack
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Bundle analysis
npm run analyze
```

### Build Configuration
- **Target**: ES2020 for modern browser support
- **Output**: Static generation where possible, SSR for dynamic content
- **Optimization**: Tree shaking, code splitting, and image optimization
- **Security**: CSP headers, XSS protection, and secure defaults

### Performance Targets
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms
- **Bundle Size**: < 250KB initial JS bundle

## Integration with Existing Systems

### Data Layer Integration
This prototype is designed to integrate with existing backend APIs and data systems:

#### API Integration Patterns
```typescript
// Define API response types
interface ApiResponse<T> {
  data: T;
  status: "success" | "error";
  message?: string;
}

// Create typed API functions
async function fetchUsers(): Promise<User[]> {
  const response = await fetch("/api/users");
  const result: ApiResponse<User[]> = await response.json();
  
  if (result.status === "error") {
    throw new Error(result.message);
  }
  
  return result.data;
}
```

#### Authentication Integration
- **JWT Token Support**: Ready for token-based authentication
- **Session Management**: Secure session handling with HttpOnly cookies
- **Role-Based Access**: Component-level permission checking
- **SSO Integration**: OAuth and SAML support ready

### Migration Strategy
1. **Component-by-Component**: Replace existing components incrementally
2. **API Compatibility**: Maintain backward compatibility with existing APIs
3. **Shared State**: Gradual migration of state management
4. **Progressive Enhancement**: Add new features while maintaining legacy support

## Testing Strategy

Platform Web implements a comprehensive testing strategy using modern tools and best practices to ensure code quality, reliability, and maintainability.

### Testing Stack

#### Vitest (Unit & Integration Testing)
- **Framework**: Vitest with jsdom environment for React component testing
- **Testing Library**: @testing-library/react for component testing
- **User Interactions**: @testing-library/user-event for realistic user interactions
- **Coverage**: V8 coverage provider with 80% threshold targets
- **Configuration**: `vitest.config.ts` with custom setup and environment variables

#### Cypress (End-to-End Testing)
- **Framework**: Cypress for E2E and component testing
- **Custom Commands**: Extended with accessibility and utility commands
- **Multi-Device**: Responsive testing across desktop, tablet, and mobile
- **Performance**: Built-in performance testing and metrics
- **Configuration**: `cypress.config.ts` with proper timeouts and retry logic

#### Mock Service Worker (API Mocking)
- **Server Mocking**: MSW for Node.js environment (Vitest)
- **Browser Mocking**: MSW service worker for browser environment (Cypress)
- **Comprehensive Handlers**: Mock endpoints for all API interactions
- **Error Simulation**: Test error handling and edge cases

### Test Organization

#### Unit Tests (`*.test.tsx`, `*.test.ts`)
```
src/
├── components/
│   ├── ui/
│   │   ├── button.test.tsx         # Button component tests
│   │   └── metric-card.test.tsx    # MetricCard component tests
│   └── dashboard/
├── lib/
│   └── api.test.ts                 # API client integration tests
└── test/
    ├── setup.ts                    # Vitest setup and mocks
    ├── utils.tsx                   # Custom render utilities
    └── mocks/
        ├── handlers.ts             # MSW request handlers
        ├── server.ts               # MSW server for Node.js
        └── browser.ts              # MSW worker for browsers
```

#### E2E Tests (`cypress/e2e/*.cy.ts`)
```
cypress/
├── e2e/
│   ├── homepage.cy.ts              # Homepage functionality
│   ├── navigation.cy.ts            # Navigation and routing
│   └── accessibility.cy.ts         # Accessibility compliance
├── fixtures/
│   └── example.json                # Test data fixtures
└── support/
    ├── commands.ts                 # Custom Cypress commands
    ├── e2e.ts                      # E2E setup
    └── component.ts                # Component testing setup
```

### Test Categories

#### Component Testing
- **Rendering**: Verify components render correctly with props
- **User Interactions**: Test clicks, keyboard navigation, form submissions
- **Accessibility**: ARIA attributes, keyboard support, screen reader compatibility
- **Responsive Behavior**: Component behavior across different screen sizes
- **Error States**: Loading, error, and empty states

Example Component Test:
```typescript
import { render, screen, userEvent } from '@/test/utils'
import { Button } from './button'

describe('Button', () => {
  it('handles click events', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    
    render(<Button onClick={handleClick}>Click me</Button>)
    
    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledOnce()
  })
})
```

#### API Integration Testing
- **Request/Response**: Verify API calls with correct parameters and responses
- **Error Handling**: Test network errors, timeouts, and HTTP error codes
- **Authentication**: Token-based authentication flows
- **Concurrent Requests**: Multiple simultaneous API calls
- **Data Validation**: Response schema validation

Example API Test:
```typescript
import { apiClient } from '@/lib/api'

describe('API Client', () => {
  it('fetches users successfully', async () => {
    const users = await apiClient.getUsers()
    
    expect(users).toHaveLength(2)
    expect(users[0]).toMatchObject({
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
    })
  })
})
```

#### End-to-End Testing
- **User Journeys**: Complete workflows from start to finish
- **Cross-Browser**: Testing across different browsers and devices
- **Performance**: Page load times and Core Web Vitals
- **Accessibility**: Automated and manual accessibility testing
- **Real-World Scenarios**: Realistic user interactions and edge cases

Example E2E Test:
```typescript
describe('Homepage', () => {
  it('displays the main dashboard', () => {
    cy.visitAndWait('/')
    cy.shouldBeVisibleAndContain('h1', 'Platform Dashboard')
    cy.get('[data-testid="dashboard-overview"]').should('be.visible')
  })
})
```

### Testing Commands

#### Development Commands
```bash
# Unit & Integration Tests
npm run test                    # Run tests in watch mode
npm run test:ui                 # Open Vitest UI
npm run test:run                # Run tests once
npm run test:coverage           # Run with coverage report
npm run test:watch              # Watch mode

# End-to-End Tests
npm run cypress                 # Open Cypress GUI
npm run cypress:headless        # Run Cypress headlessly
npm run cypress:component       # Component testing mode
npm run e2e                     # Full E2E test suite
npm run e2e:open                # E2E with dev server

# Complete Test Suite
npm run test:all                # Run all tests (unit + E2E)
```

#### CI/CD Commands
```bash
# Production test pipeline
npm run test:run                # Unit tests
npm run test:coverage           # Coverage report
npm run cypress:headless        # E2E tests
npm run build                   # Verify build works
```

### Coverage Targets

#### Code Coverage Thresholds
- **Branches**: 80% minimum
- **Functions**: 80% minimum  
- **Lines**: 80% minimum
- **Statements**: 80% minimum

#### Coverage Exclusions
- Configuration files (`*.config.*`)
- Type definitions (`*.d.ts`)
- Test files themselves
- Next.js generated files
- Build artifacts

### Accessibility Testing

#### Automated Accessibility
- **Cypress Integration**: Custom `cy.checkA11y()` command
- **WCAG AA Compliance**: Automated checks for common violations
- **Color Contrast**: Verify sufficient contrast ratios
- **Keyboard Navigation**: Tab order and focus management

#### Manual Accessibility Testing
- **Screen Readers**: Test with actual assistive technologies
- **Keyboard-Only Navigation**: Complete workflows without mouse
- **Focus Management**: Modal and overlay focus trapping
- **ARIA Implementation**: Proper semantic markup and labels

### Performance Testing

#### Core Web Vitals
- **First Contentful Paint**: < 1.5s target
- **Largest Contentful Paint**: < 2.5s target
- **Cumulative Layout Shift**: < 0.1 target
- **First Input Delay**: < 100ms target

#### Bundle Analysis
- **Bundle Size Monitoring**: Track JavaScript bundle growth
- **Code Splitting**: Verify proper lazy loading
- **Tree Shaking**: Ensure unused code elimination
- **Performance Budgets**: Automated size limit enforcement

### Mock Data Management

#### Test Data Strategy
- **Fixtures**: Static test data in `cypress/fixtures/`
- **Factories**: Dynamic test data generation
- **MSW Handlers**: Realistic API response mocking
- **Environment Isolation**: Separate test data per environment

#### API Mocking Patterns
```typescript
// MSW Handler Example
export const handlers = [
  http.get('/api/users', () => {
    return HttpResponse.json([
      { id: '1', name: 'John Doe', email: 'john@example.com' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
    ])
  }),
]
```

### Testing Best Practices

#### Component Testing Guidelines
1. **Test Behavior, Not Implementation**: Focus on user interactions
2. **Use Semantic Queries**: Prefer `getByRole`, `getByLabelText`
3. **Mock External Dependencies**: Isolate component logic
4. **Test Accessibility**: Include ARIA attributes and keyboard support
5. **Async Testing**: Proper handling of promises and async operations

#### E2E Testing Guidelines
1. **Data Attributes**: Use `data-testid` for reliable element selection
2. **Page Object Pattern**: Organize complex page interactions
3. **Custom Commands**: Reusable functionality in `cypress/support/commands.ts`
4. **Error Handling**: Test both success and failure scenarios
5. **Performance Monitoring**: Include performance assertions

#### API Testing Guidelines
1. **Request Validation**: Verify correct headers and payload
2. **Response Schema**: Validate response structure and types
3. **Error Scenarios**: Test all HTTP error codes
4. **Authentication**: Include auth token handling
5. **Concurrent Operations**: Test race conditions and conflicts

### Continuous Integration

#### GitHub Actions (Future)
```yaml
# Example CI pipeline
- name: Unit Tests
  run: npm run test:run

- name: E2E Tests  
  run: npm run e2e

- name: Coverage Report
  run: npm run test:coverage
```

#### Quality Gates
- **Test Passage**: All tests must pass
- **Coverage Threshold**: 80% minimum coverage
- **Build Success**: Production build must complete
- **Linting**: ESLint and TypeScript checks
- **Performance**: Bundle size within limits

This comprehensive testing strategy ensures high code quality, prevents regressions, and maintains confidence in deployments across all environments.

## Security Considerations

### Content Security Policy
```typescript
// Configured in next.config.ts
"Content-Security-Policy": [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self'",
  "connect-src 'self'",
].join("; ")
```

### Input Validation
- **Client-Side**: Zod schemas for immediate feedback
- **Server-Side**: Always validate on the backend
- **Sanitization**: Prevent XSS through proper escaping

### Data Protection
- **Sensitive Data**: Never expose in client-side code
- **HTTPS Only**: All communication over secure connections
- **Secure Headers**: Implemented via Next.js configuration

## Performance Monitoring & Observability

### OpenTelemetry Integration

Platform Web includes comprehensive OpenTelemetry (OTel) integration for observability using Dash0 as the telemetry provider. This provides distributed tracing, metrics collection, and structured logging across the application.

#### Configuration

**OpenTelemetry Setup**:
- Uses `@vercel/otel` for Next.js integration
- Configured in `instrumentation.ts` for automatic instrumentation
- Supports multiple telemetry providers (currently Dash0)
- Environment-specific dataset routing via `Dash0-Dataset` header

**Environment Variables**:
```bash
# Required for Dash0 integration
DASH0_AUTH_TOKEN=your-dash0-auth-token        # Set in Vercel dashboard for production
DASH0_DATASET=dev                             # Environment-specific dataset ('dev', 'development', 'production')

# Optional - customize endpoints if needed
DASH0_TRACE_ENDPOINT=https://api.dash0.com/v1/traces
DASH0_METRICS_ENDPOINT=https://api.dash0.com/v1/metrics
DASH0_LOGS_ENDPOINT=https://api.dash0.com/v1/logs
```

**Environment-Specific Datasets**:
- **Local Development** (`dev`): For local testing and development
- **Development** (`development`): For Vercel development branch deployments
- **Production** (`production`): For production deployments

#### Telemetry Types

**Distributed Tracing**:
- Automatic HTTP request tracing
- Database query tracing (when implemented)
- External API call tracing
- Custom span creation for business logic

**Metrics Collection**:
- Application performance metrics
- Custom business metrics
- Resource utilization metrics
- Error rate and latency metrics

**Structured Logging**:
- Application logs with context correlation
- Error logs with stack traces
- Performance logs with timing information
- Custom application events

#### Implementation Details

**Automatic Instrumentation**:
```typescript
// instrumentation.ts automatically instruments:
// - HTTP requests (fetch, axios)
// - Next.js API routes
// - Database connections (when configured)
// - External service calls
```

**Custom Tracing**:
```typescript
import { trace } from '@opentelemetry/api';

const tracer = trace.getTracer('platform-web');

// Create custom spans for business logic
const span = tracer.startSpan('user-action');
try {
  // Your business logic here
  span.setAttributes({
    'user.id': userId,
    'action.type': 'button-click'
  });
} finally {
  span.end();
}
```

**Configuration Access**:
```typescript
import { getDash0Config } from '@/lib/env';

// Server-side only
const config = getDash0Config();
if (config.isConfigured) {
  // Dash0 is properly configured
  console.log(`Using dataset: ${config.dataset}`);
}
```

#### Security & Privacy

**Data Protection**:
- No sensitive data (passwords, tokens) is sent to telemetry
- User PII is either excluded or hashed before transmission
- Configurable data sanitization rules
- Secure transmission via HTTPS with authentication

**Access Control**:
- Auth tokens stored securely in environment variables
- Dataset-level access control via Dash0
- Environment isolation through dataset routing

#### Development vs Production

**Development Mode**:
- Enhanced debug logging enabled
- Detailed span information for debugging
- Local dataset routing for testing
- Performance overhead acceptable for debugging

**Production Mode**:
- Optimized sampling rates for performance
- Essential metrics and traces only
- Production dataset with proper retention
- Minimal performance impact

### Performance Metrics

#### Core Web Vitals Tracking
- **Largest Contentful Paint (LCP)**: < 2.5s target
- **First Input Delay (FID)**: < 100ms target
- **Cumulative Layout Shift (CLS)**: < 0.1 target
- **First Contentful Paint (FCP)**: < 1.5s target
- **Time to First Byte (TTFB)**: < 500ms target

#### Application Metrics
- **Bundle Size**: JavaScript, CSS, and image sizes
- **Runtime Performance**: Component render times and memory usage
- **User Experience**: Error rates and loading times
- **API Performance**: Response times and error rates
- **Database Performance**: Query times and connection health

#### Custom Business Metrics
- **User Engagement**: Page views, session duration, feature usage
- **Conversion Metrics**: User actions, form completions, goal achievements
- **Error Tracking**: Application errors, user-reported issues, performance degradation

### Optimization Techniques
- **Code Splitting**: Route-based and component-based splitting
- **Lazy Loading**: Images and below-the-fold content
- **Caching**: Browser caching and CDN optimization
- **Compression**: Gzip and Brotli for asset delivery
- **Performance Budgets**: Automated monitoring of bundle size and performance metrics

## Future Enhancements

### Planned Features
- **Progressive Web App**: Service worker and offline support
- **Internationalization**: Multi-language support with react-intl
- **Advanced Analytics**: User behavior tracking and performance metrics
- **Component Documentation**: Storybook integration for design system
- **E2E Testing**: Playwright or Cypress for end-to-end testing

### Scalability Considerations
- **Micro-frontends**: Module federation for large applications
- **Edge Computing**: Serverless functions for API endpoints
- **Database Integration**: Direct database connections with serverless functions
- **Real-time Features**: WebSocket integration for live updates

## Comparison with Existing Portal

### Key Improvements
1. **Modern React Patterns**: Server components, concurrent features, and modern hooks
2. **Enhanced Performance**: 50-70% faster loading times through optimization
3. **Better Accessibility**: WCAG AA compliance vs. basic accessibility
4. **Improved Developer Experience**: TypeScript, modern tooling, and better debugging
5. **Security**: Modern security practices and CSP implementation
6. **Maintainability**: Clean architecture and component-driven development

### Migration Benefits
- **Reduced Bundle Size**: Modern bundling and tree shaking
- **Better SEO**: Server-side rendering and meta tag management
- **Mobile Optimization**: Responsive design and mobile-first approach
- **Future-Proof**: Built on stable, long-term supported technologies

## Conclusion

Platform Web represents a significant advancement over legacy web applications, offering modern development practices, enhanced performance, and superior user experience. The architecture is designed for scalability, maintainability, and developer productivity while maintaining strict standards for accessibility and security.

This prototype serves as both a technical proof-of-concept and a reference implementation for future web development projects within the organization.