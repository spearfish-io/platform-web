# Authentication Modes

Platform Web supports three authentication modes for flexible development, testing, and integration:

## 🔧 Mock Authentication Mode

Uses MSW (Mock Service Worker) to simulate authentication responses without requiring any backend service.

**Benefits:**
- ✅ **No external dependencies** - works completely offline
- ✅ **Fast development** - instant authentication responses  
- ✅ **Consistent test data** - same user accounts every time
- ✅ **Error testing** - easily test different authentication scenarios

**Test Credentials:**
- **Admin**: `admin@spearfish.io` / `Password123!`
- **User**: `user@spearfish.io` / `UserPass123!` 
- **Test**: `test@example.com` / `TestPass123!`

## 🔗 OAuth Platform-API Mode (Default)

Connects to the modern OAuth 2.0 platform-api service for authentication.

**Benefits:**
- ✅ **Modern OAuth 2.0** - industry-standard authentication
- ✅ **Future-ready** - designed for new applications
- ✅ **Enhanced security** - modern token-based authentication
- ✅ **Microservices ready** - supports distributed architecture

**Requirements:**
- Platform-api OAuth service must be running on port 5001
- Valid user accounts in the platform-api database
- OAuth client configuration

## 🍪 Legacy Authentication Mode

Uses cookie-based authentication compatible with the existing portal-spearfish application.

**Benefits:**
- ✅ **Existing integration** - works with current user database
- ✅ **Proven system** - battle-tested authentication flow
- ✅ **Seamless migration** - no changes to existing users
- ✅ **Cookie compatibility** - works with existing session management

**Requirements:**
- Legacy API server must be running on the configured URL (default: port 5000)
- Valid user accounts in the existing Spearfish database
- ASP.NET Core Identity cookie system

## Quick Commands

```bash
# Switch to mock authentication (MSW)
npm run auth:mock

# Switch to OAuth platform-api (default)
npm run auth:oauth

# Switch to legacy cookie-based authentication
npm run auth:legacy

# Check current authentication mode
npm run auth:status
```

## Manual Configuration

You can also manually edit `.env.local`:

```bash
# Single environment variable for authentication mode
NEXT_PUBLIC_AUTH_MODE=mock    # For mock authentication (MSW)
NEXT_PUBLIC_AUTH_MODE=legacy  # For legacy cookie-based authentication  
NEXT_PUBLIC_AUTH_MODE=oauth   # For OAuth platform-api (default)

# Or leave unset for default OAuth mode
# NEXT_PUBLIC_AUTH_MODE=oauth
```

## Development Workflow

### Starting New Feature Development

```bash
# Use mocks for rapid development
npm run auth:mock
npm run dev

# Develop your feature with instant authentication
```

### OAuth Integration Testing

```bash
# Switch to OAuth API for modern integration testing
npm run auth:oauth

# Start platform-api if not running
cd ../platform-api
dotnet run

# Test with OAuth authentication
npm run dev
```

### Legacy Integration Testing

```bash
# Switch to legacy API for existing system integration
npm run auth:legacy

# Start legacy API server if not running
cd ../Server/api_server/APIServerApp
dotnet run

# Test with legacy authentication
npm run dev
```

### Team Development

**Default State**: OAuth platform-api mode (no environment variables set)
- New team members get modern authentication by default
- Prepares codebase for future OAuth migration

**Mock Mode**: Explicitly enabled for development
- Individual developers can enable mocks for rapid development
- Clear indication when mocks are active

**Legacy Mode**: Available for compatibility testing
- Test integration with existing authentication system
- Validate migration paths and compatibility

## Troubleshooting

### "Authentication failed" with OAuth mode

1. **Check if platform-api OAuth service is running:**
   ```bash
   curl http://localhost:5001/health
   # or 
   curl http://localhost:5000/health
   ```

2. **Verify API URL in `.env.local`:**
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:5000/
   ```

3. **Check platform-api logs** for OAuth authentication errors

### "Authentication failed" with legacy mode

1. **Check if legacy API server is running:**
   ```bash
   curl http://localhost:5000/health
   ```

2. **Verify legacy server is using cookie authentication**

3. **Check Server/api_server logs** for authentication errors

### Mock mode not working

1. **Check browser console** for MSW initialization messages
2. **Verify environment variable:**
   ```bash
   npm run auth:status
   ```
3. **Restart development server** after changing modes

### Switching between modes

**Always restart your development server** after switching authentication modes:

```bash
# Stop current server (Ctrl+C)
npm run auth:mock     # or npm run auth:oauth or npm run auth:legacy
npm run dev           # Restart with new mode
```

## Technical Details

### How It Works

1. **Single Environment Variable**: `NEXT_PUBLIC_AUTH_MODE` determines authentication mode
2. **Mode Detection**: Simple string check for 'mock', 'oauth', or 'legacy' (defaults to 'oauth')
3. **MSW Initialization**: Only starts if mock mode is enabled
4. **Request Routing**: API route switches between mock, OAuth, and legacy handlers based on mode
5. **Cookie Forwarding**: Legacy mode forwards cookies for session management

### Browser Console Output

**Mock Mode:**
```
🔧 Authentication Configuration:
   Mode: mock
   API URL: http://localhost:5000/
   📝 Test credentials:
      admin@spearfish.io / password123
      ...
🔧 Initializing MSW for mock authentication...
✅ MSW initialized - authentication requests will be mocked
```

**OAuth Mode:**
```
🔧 Authentication Configuration:
   Mode: oauth
   API URL: http://localhost:5000/
   🔗 Using OAuth 2.0 platform-api
   💡 Set NEXT_PUBLIC_AUTH_MODE=mock to use mocks
   💡 Set NEXT_PUBLIC_AUTH_MODE=legacy to use legacy auth
```

**Legacy Mode:**
```
🔧 Authentication Configuration:
   Mode: legacy
   API URL: http://localhost:5000/
   🍪 Using legacy cookie-based authentication
   💡 Set NEXT_PUBLIC_AUTH_MODE=mock to use mocks
```

### File Structure

```
src/
├── test/mocks/
│   ├── handlers.ts      # MSW request handlers
│   ├── browser.ts       # Browser service worker setup
│   └── server.ts        # Node.js server setup (for SSR)
├── lib/
│   └── auth-mode.ts     # Authentication mode utilities
├── components/
│   └── msw-provider.tsx # MSW initialization component
└── app/
    └── layout.tsx       # MSW provider integration

scripts/
└── auth-mode.js         # CLI tool for switching modes
```