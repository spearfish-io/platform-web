# Authentication Architecture Specification

## Overview

This document outlines the comprehensive refactoring of Platform Web's authentication system to support three distinct authentication modes with clean separation of concerns, following all Platform Web best practices for styling, accessibility, testing, security, and responsiveness.

## 🎯 Goals

### Primary Objectives
- **Clean separation** of three authentication modes
- **Follow Platform Web standards**: Pure Radix UI, WCAG AA, security best practices
- **Maintainable architecture** with clear responsibilities
- **Comprehensive testing** and documentation
- **Enterprise-ready** authentication flows

### Success Criteria
- ✅ Zero custom CSS classes (Pure Radix UI Themes only)
- ✅ WCAG AA accessibility compliance
- ✅ >80% test coverage
- ✅ Bundle size <250KB
- ✅ Core Web Vitals targets met
- ✅ Complete TypeScript coverage
- ✅ Security audit passing

## 🏗️ Authentication Modes

### Mode 1: OIDC Flow (`NEXT_PUBLIC_AUTH_MODE=oauth`)
**Purpose**: Modern OAuth 2.0/OpenID Connect authentication for production

**Flow**:
```
User → Redirect Button → Identity Provider → JWT Tokens → Dashboard
```

**Providers**:
- `spearfish-oidc` - Spearfish Identity Provider
- `google` - Google OIDC
- `microsoft` - Microsoft OIDC (new)

**Backend**: `~/projects/platform-api/src/Spearfish.Identity.API/Controllers/Auth/AuthController.cs`

**User Experience**:
- Provider selection buttons
- Redirect to external identity provider
- No custom login forms
- JWT token-based session management

### Mode 2: Legacy Credentials (`NEXT_PUBLIC_AUTH_MODE=legacy`)
**Purpose**: Cookie-based authentication for legacy system compatibility

**Flow**:
```
User → Login Form → Legacy API → HTTP Cookies → Dashboard
```

**Provider**:
- `spearfish-legacy` - Credentials provider for legacy auth

**Backend**: `~/projects/Server/api_server/APIServerApp/Controllers/Auth`

**User Experience**:
- Traditional email/password form
- HTTP cookie-based sessions
- Legacy API integration

### Mode 3: Mock Authentication (`NEXT_PUBLIC_AUTH_MODE=mock`)
**Purpose**: Development and testing without external dependencies

**Flow**:
```
User → Mock Form → MSW Handlers → Mock Response → Dashboard
```

**Provider**:
- `spearfish-mock` - Mock credentials provider

**Backend**: MSW intercepted requests

**User Experience**:
- Development login form
- Predefined test credentials
- Offline development capability

## 📁 File Structure

```
src/
├── components/auth/           # Authentication components
│   ├── oidc/                  # OIDC-specific components
│   │   ├── oidc-signin-form.tsx
│   │   ├── oidc-provider-button.tsx
│   │   └── oidc-signin-form.stories.tsx
│   ├── legacy/                # Legacy auth components
│   │   ├── legacy-login-form.tsx
│   │   ├── legacy-login-form.test.tsx
│   │   └── legacy-login-form.stories.tsx
│   ├── mock/                  # Mock auth components
│   │   ├── mock-login-form.tsx
│   │   ├── mock-login-form.test.tsx
│   │   └── mock-login-form.stories.tsx
│   ├── shared/                # Shared auth components
│   │   ├── auth-mode-router.tsx
│   │   ├── auth-error-display.tsx
│   │   ├── auth-loading-state.tsx
│   │   └── auth-form-layout.tsx
│   └── auth-providers.tsx     # Provider selection component
├── lib/auth/                  # Authentication logic
│   ├── providers/             # Auth.js provider configurations
│   │   ├── oidc-providers.ts
│   │   ├── legacy-provider.ts
│   │   └── mock-provider.ts
│   ├── utils/                 # Auth utilities
│   │   ├── auth-validation.ts
│   │   ├── auth-security.ts
│   │   ├── auth-tokens.ts
│   │   └── auth-errors.ts
│   ├── hooks/                 # Auth hooks
│   │   ├── use-auth-mode.ts
│   │   ├── use-oidc-signin.ts
│   │   ├── use-legacy-signin.ts
│   │   └── use-mock-signin.ts
│   └── auth-config.ts         # Main Auth.js configuration
├── types/auth/                # Authentication types
│   ├── providers.ts
│   ├── sessions.ts
│   ├── tokens.ts
│   └── errors.ts
└── tests/auth/               # Authentication tests
    ├── unit/
    ├── integration/
    ├── e2e/
    └── accessibility/
```

## 🎨 Component Architecture

### Design System Compliance (Pure Radix UI Themes)

**Styling Rules**:
- ✅ **Zero custom CSS classes** - all styling via Radix props
- ✅ **Responsive design** using Radix responsive props
- ✅ **Color system** using Radix color tokens (`color="blue"`, etc.)
- ✅ **Typography** using semantic sizing (`size="1"` through `size="9"`)
- ✅ **Spacing** using Radix spacing props (`p`, `m`, `gap`)
- ✅ **CSS variables** for advanced styling (`var(--blue-9)`)

### Component Specifications

#### `AuthModeRouter`
**Purpose**: Route users to appropriate auth component based on mode
```typescript
interface AuthModeRouterProps {
  mode?: AuthMode
  onAuthSuccess?: (user: SpearfishUser) => void
  onAuthError?: (error: AuthError) => void
}
```

#### `OIDCSignInForm`
**Purpose**: Provider selection and OIDC redirect handling
```typescript
interface OIDCSignInFormProps {
  providers?: OIDCProvider[]
  callbackUrl?: string
  onProviderSelect?: (provider: string) => void
}
```

#### `LegacyLoginForm`
**Purpose**: Traditional email/password authentication
```typescript
interface LegacyLoginFormProps {
  onSubmit?: (credentials: LoginCredentials) => void
  enableRememberMe?: boolean
  maxAttempts?: number
}
```

#### `MockLoginForm`
**Purpose**: Development authentication with test credentials
```typescript
interface MockLoginFormProps {
  testCredentials?: MockCredentials[]
  onSubmit?: (credentials: LoginCredentials) => void
  showCredentialHints?: boolean
}
```

## 🔒 Security Implementation

### Input Validation
- **Client-side**: Zod schemas with comprehensive validation
- **Server-side**: Backend validation (never trust client)
- **Sanitization**: XSS prevention and input cleaning

### Rate Limiting
- **Max attempts**: 5 failed attempts per email
- **Lockout duration**: 15 minutes exponential backoff
- **IP-based**: Additional IP-level rate limiting

### Token Security
- **JWT validation**: Proper signature verification
- **Token storage**: Secure HttpOnly cookies
- **Token refresh**: Automatic renewal before expiration
- **Token revocation**: Proper logout handling

### Content Security Policy
```typescript
const cspDirectives = {
  'default-src': "'self'",
  'script-src': "'self' 'unsafe-eval'",
  'style-src': "'self' 'unsafe-inline'",
  'connect-src': "'self' https://identity.spearfish.io",
  'img-src': "'self' data: https:",
}
```

## ♿ Accessibility Implementation (WCAG AA)

### Semantic HTML
- **Form structure**: Proper fieldsets, legends, labels
- **Headings**: Logical heading hierarchy (h1, h2, h3)
- **Landmarks**: Main, navigation, form landmarks

### ARIA Support
- **Labels**: `aria-label`, `aria-labelledby` for all inputs
- **Descriptions**: `aria-describedby` for help text and errors
- **Live regions**: `aria-live` for dynamic error announcements
- **States**: `aria-invalid`, `aria-expanded` for form states

### Keyboard Navigation
- **Tab order**: Logical keyboard navigation flow
- **Focus management**: Visible focus indicators
- **Keyboard shortcuts**: Enter to submit, Escape to cancel
- **Focus trapping**: Modal focus containment

### Screen Reader Support
- **Status announcements**: Form submission status
- **Error handling**: Clear error descriptions
- **Progress indication**: Loading state announcements
- **Context**: Clear form purpose and requirements

## 🧪 Testing Strategy

### Unit Tests (Jest + React Testing Library)
```typescript
// Component rendering tests
describe('AuthModeRouter', () => {
  it('renders OIDC form for oauth mode', () => {})
  it('renders legacy form for legacy mode', () => {})
  it('renders mock form for mock mode', () => {})
})

// Authentication logic tests
describe('useOIDCSignIn', () => {
  it('redirects to correct provider', () => {})
  it('handles provider errors', () => {})
  it('manages loading states', () => {})
})
```

### Integration Tests (API + Components)
```typescript
// Auth flow integration
describe('OIDC Authentication Flow', () => {
  it('completes full OIDC authentication', () => {})
  it('handles token refresh', () => {})
  it('manages session expiration', () => {})
})
```

### Accessibility Tests (axe-core)
```typescript
// A11y compliance testing
describe('Authentication Accessibility', () => {
  it('passes axe accessibility audit', () => {})
  it('supports keyboard navigation', () => {})
  it('provides proper ARIA labels', () => {})
})
```

### End-to-End Tests (Playwright)
```typescript
// Complete user flows
describe('Authentication E2E', () => {
  it('completes OIDC sign-in flow', () => {})
  it('handles legacy authentication', () => {})
  it('supports mock authentication', () => {})
})
```

### Performance Tests
```typescript
// Bundle size and performance
describe('Authentication Performance', () => {
  it('meets bundle size requirements', () => {})
  it('achieves Core Web Vitals targets', () => {})
  it('loads components efficiently', () => {})
})
```

## 📊 Performance Targets

### Bundle Size
- **Authentication components**: <50KB combined
- **Auth.js providers**: Lazy loaded per mode
- **Total auth bundle**: <100KB including dependencies

### Core Web Vitals
- **First Contentful Paint**: <1.5s
- **Largest Contentful Paint**: <2.5s
- **First Input Delay**: <100ms
- **Cumulative Layout Shift**: <0.1

### Loading Performance
- **Component lazy loading**: Auth components loaded on demand
- **Provider lazy loading**: Only load required providers
- **Code splitting**: Separate bundles per auth mode

## 📚 Documentation Requirements

### Storybook Integration
- **Component stories**: All auth components documented
- **Interactive examples**: Live component playground
- **Accessibility tests**: Built-in a11y validation
- **Design system**: Integration with Radix UI Themes

### Technical Documentation
- **API documentation**: OpenAPI specs for auth endpoints
- **Integration guides**: How to implement each auth mode
- **Troubleshooting**: Common issues and solutions
- **Migration guide**: Moving from current to new architecture

## 🚀 Implementation Timeline

### Phase 1: Foundation (Week 1)
- [ ] Create component architecture
- [ ] Set up testing infrastructure
- [ ] Implement base Auth.js configuration
- [ ] Create shared authentication utilities

### Phase 2: Core Implementation (Week 2)
- [ ] Implement OIDC components and flows
- [ ] Implement Legacy authentication components
- [ ] Update Mock authentication integration
- [ ] Add comprehensive error handling

### Phase 3: Polish & Testing (Week 3)
- [ ] Implement accessibility features
- [ ] Add comprehensive test suite
- [ ] Performance optimization
- [ ] Security audit and fixes

### Phase 4: Documentation & Integration (Week 4)
- [ ] Create Storybook documentation
- [ ] Write integration guides
- [ ] Performance testing and optimization
- [ ] Final security and accessibility audit

## ✅ Acceptance Criteria

### Functional Requirements
- [ ] All three auth modes work independently
- [ ] Provider selection works correctly
- [ ] Session management functions properly
- [ ] Error handling is comprehensive
- [ ] Loading states are implemented

### Technical Requirements
- [ ] Pure Radix UI Themes implementation
- [ ] TypeScript strict mode compliance
- [ ] >80% test coverage achieved
- [ ] Bundle size <250KB total
- [ ] Core Web Vitals targets met

### Quality Requirements
- [ ] WCAG AA accessibility compliance
- [ ] Security audit passes
- [ ] Cross-browser compatibility verified
- [ ] Mobile responsiveness confirmed
- [ ] Performance benchmarks met

### Documentation Requirements
- [ ] Complete Storybook documentation
- [ ] Technical integration guides
- [ ] Accessibility compliance report
- [ ] Security review documentation
- [ ] Performance audit results

## 🔄 Migration Strategy

### Current State Analysis
- Identify existing authentication touchpoints
- Document current user flows
- Catalog existing security implementations
- Assess current accessibility compliance

### Migration Steps
1. **Parallel implementation** - New components alongside existing
2. **Gradual rollout** - Feature flag controlled deployment  
3. **A/B testing** - Compare new vs old authentication flows
4. **Full migration** - Remove legacy authentication code
5. **Monitoring** - Track authentication metrics and errors

This specification provides a comprehensive roadmap for implementing enterprise-grade authentication that follows all Platform Web best practices while maintaining the modern, accessible, and performant architecture the project requires.