# Spearfish Authentication Cookie Structure

This document describes the structure and data contained in the Spearfish authentication cookies used by the legacy authentication system.

## Cookie Overview

The Spearfish platform uses several cookies for authentication and session management. Here's the breakdown of the cookies in your session:

```
R_PCS=dark; 
R_LOCALE=en-us; 
R_USERNAME=admin; 
username-localhost-8888="2|1:0|10:1758601418|23:username-localhost-8888|200:eyJ1c2VybmFtZSI6ICIwNzA3YTlkMWY1Mjg0MDEwOTUwMzc1NDEzNDhlOGE4NiIsICJuYW1lIjogIkFub255bW91cyBWYWxldHVkbyIsICJkaXNwbGF5X25hbWUiOiAiQW5vbnltb3VzIFZhbGV0dWRvIiwgImluaXRpYWxzIjogIkFWIiwgImNvbG9yIjogbnVsbH0=|cd9b19ed7ef6ecfe315c49d6a86caa0ee4c498ecade838d710f5b441a7e0cd14"; 
ajs_anonymous_id=9998e489-4d89-4326-a564-8e339b72734b; 
spearfish.csrf-token=904f63843cf5c5aa0101a41c4ffcb9cce0015c410df162d0e5989e3f3ea007c3%7C0c3749fb51b54f15277be66613964f58e52698813727ffc66c1b2ca20a378726; 
spearfish.callback-url=http%3A%2F%2Flocalhost%3A3000; 
.Spearfish.Identity=CfDJ8Pa4QuMk3JFLk10ArHqNr-UI...
```

## Cookie Breakdown

### 1. User Preference Cookies

#### `R_PCS=dark`
- **Purpose**: User's preferred color scheme
- **Values**: `dark` | `light`
- **Type**: String

#### `R_LOCALE=en-us` 
- **Purpose**: User's preferred language/locale setting
- **Values**: ISO locale codes (e.g., `en-us`, `es-es`, `fr-fr`)
- **Type**: String

#### `R_USERNAME=admin`
- **Purpose**: Username identifier for quick reference
- **Values**: Username string
- **Type**: String
- **Note**: This appears to be for convenience/display purposes

### 2. Session Management Cookies

#### `username-localhost-8888` (Secure Tornado Cookie)
- **Purpose**: Signed session data containing user profile information
- **Format**: Tornado secure cookie format: `version|signature|timestamp|name|length:base64_data|mac`
- **Structure**: `2|1:0|10:1758601418|23:username-localhost-8888|200:eyJ1c2VybmFtZSI6ICIwNzA3YTlkMWY1Mjg0MDEwOTUwMzc1NDEzNDhlOGE4NiIsICJuYW1lIjogIkFub255bW91cyBWYWxldHVkbyIsICJkaXNwbGF5X25hbWUiOiAiQW5vbnltb3VzIFZhbGV0dWRvIiwgImluaXRpYWxzIjogIkFWIiwgImNvbG9yIjogbnVsbH0=|cd9b19ed7ef6ecfe315c49d6a86caa0ee4c498ecade838d710f5b441a7e0cd14`

**Decoded JSON payload** (from base64):
```json
{
  "username": "0707a9d1f528401095037541348e8a86",
  "name": "Anonymous Valetudo", 
  "display_name": "Anonymous Valetudo",
  "initials": "AV",
  "color": null
}
```

**Fields**:
- `username`: Internal user identifier (GUID-like)
- `name`: Full user name
- `display_name`: Display name for UI
- `initials`: User initials for avatars
- `color`: Custom color preference (nullable)

### 3. Analytics & Tracking

#### `ajs_anonymous_id=9998e489-4d89-4326-a564-8e339b72734b`
- **Purpose**: Analytics.js anonymous user identifier
- **Format**: UUID v4
- **Type**: String
- **Usage**: User behavior tracking and analytics

### 4. Security & CSRF Protection

#### `spearfish.csrf-token`
- **Purpose**: Cross-Site Request Forgery protection token
- **Format**: URL-encoded token with pipe-separated components
- **Structure**: `token|signature`
- **Decoded**: `904f63843cf5c5aa0101a41c4ffcb9cce0015c410df162d0e5989e3f3ea007c3|0c3749fb51b54f15277be66613964f58e52698813727ffc66c1b2ca20a378726`

#### `spearfish.callback-url`
- **Purpose**: OAuth/authentication callback URL
- **Format**: URL-encoded string
- **Decoded**: `http://localhost:3000`

### 5. Primary Authentication Cookie

#### `.Spearfish.Identity` (ASP.NET Core Data Protection)
- **Purpose**: Primary authentication and session data
- **Format**: ASP.NET Core Data Protection encrypted payload
- **Structure**: Encrypted, cannot be decoded without server-side keys
- **Contents** (based on server-side session data):
  - User ID and email
  - Current tenant information (`tenantId`, `tenantName`)
  - User roles and permissions
  - Tenant memberships (comma-separated tenant IDs)
  - Session expiration data
  - Security timestamps

**Typical server-side session structure**:
```json
{
  "userId": "user-guid",
  "email": "user@example.com", 
  "name": "User Name",
  "tenantId": 123,
  "tenantName": "Current Tenant Name",
  "tenantMemberships": "123,456,789", // Comma-separated tenant IDs
  "roles": ["TenantAdminRole", "User"],
  "version": "1.0.0",
  "buildTime": "2024-01-01T00:00:00Z"
}
```

## Cookie Security Notes

### Encryption & Signing
- **`.Spearfish.Identity`**: Encrypted using ASP.NET Core Data Protection
- **`username-localhost-8888`**: Signed using Tornado secure cookie mechanism
- **`spearfish.csrf-token`**: Contains signature for CSRF validation

### Expiration & Scope
- **HttpOnly**: Primary auth cookies are HttpOnly (not accessible via JavaScript)
- **Secure**: Cookies should be sent over HTTPS in production
- **SameSite**: Configured for CSRF protection
- **Domain**: Scoped to Spearfish domain hierarchy

## Multi-Tenant Architecture

The cookie structure supports multi-tenant functionality:

1. **Current Tenant**: Stored in `.Spearfish.Identity` as `tenantId` and `tenantName`
2. **Tenant Memberships**: Comma-separated list of accessible tenant IDs
3. **Tenant Switching**: Requires server-side API call to update session context

### Tenant Access Pattern
1. User has access to multiple tenants (stored in `tenantMemberships`)
2. One tenant is "active" at any time (`tenantId`)
3. Switching tenants requires API call: `PUT /api/auth/session/tenant/{tenantId}`
4. Server updates the `.Spearfish.Identity` cookie with new tenant context

## Development Notes

### For Platform-Web Integration
- Parse `tenantMemberships` from session data to show all accessible tenants
- Use current `tenantId` to highlight active tenant in UI
- Implement tenant switching via API proxy to legacy backend
- Handle cookie forwarding for authenticated requests

### Security Considerations
- Never decode `.Spearfish.Identity` on client side
- Always validate CSRF tokens on state-changing requests
- Respect HttpOnly flag on authentication cookies
- Forward all cookies when proxying to legacy API

## API Integration

### Session Validation
```typescript
// Get current session
GET /api/auth/session
Cookie: .Spearfish.Identity=...

Response:
{
  "userId": "guid",
  "email": "user@example.com",
  "tenantId": 123,
  "tenantName": "Current Tenant",
  "tenantMemberships": "123,456,789",
  "roles": ["TenantAdminRole"]
}
```

### Tenant Switching
```typescript
// Switch tenant context  
PUT /api/auth/session/tenant/456
Cookie: .Spearfish.Identity=...

Response:
{
  // Updated session data with new tenant context
  "tenantId": 456,
  "tenantName": "New Tenant Name",
  "roles": ["User"] // Roles may change per tenant
}
```

This cookie structure enables secure, multi-tenant authentication while maintaining compatibility with both legacy and modern web applications.