# Authentication Modes

Platform Web supports two authentication modes for flexible development and testing:

## 🔧 Mock Authentication Mode

Uses MSW (Mock Service Worker) to simulate authentication responses without requiring the platform-api to be running.

**Benefits:**
- ✅ **No external dependencies** - works completely offline
- ✅ **Fast development** - instant authentication responses  
- ✅ **Consistent test data** - same user accounts every time
- ✅ **Error testing** - easily test different authentication scenarios

**Test Credentials:**
- **Admin**: `admin@spearfish.io` / `password123`
- **User**: `user@spearfish.io` / `user123456` 
- **Test**: `test@example.com` / `test12345`

## 🔗 Real API Mode (Default)

Connects to the actual platform-api service for authentication.

**Benefits:**
- ✅ **Real integration testing** - tests actual API behavior
- ✅ **Production-like behavior** - matches deployed environment
- ✅ **Full feature testing** - all authentication features available

**Requirements:**
- Platform-api service must be running on the configured URL
- Valid user accounts in the platform-api database

## Quick Commands

```bash
# Switch to mock authentication
npm run auth:mock

# Switch to real platform-api
npm run auth:real

# Check current authentication mode
npm run auth:status
```

## Manual Configuration

You can also manually edit `.env.local`:

```bash
# For mock authentication
NEXT_PUBLIC_USE_MOCK_AUTH=true

# For real platform-api (default behavior)
# NEXT_PUBLIC_USE_MOCK_AUTH=true
```

## Development Workflow

### Starting New Feature Development

```bash
# Use mocks for rapid development
npm run auth:mock
npm run dev

# Develop your feature with instant authentication
```

### Integration Testing

```bash
# Switch to real API for integration testing
npm run auth:real

# Start platform-api if not running
cd ../platform-api
dotnet run

# Test with real authentication
npm run dev
```

### Team Development

**Default State**: Real API mode (no environment variable set)
- New team members get production-like behavior by default
- No surprise mock responses in shared environments

**Mock Mode**: Explicitly enabled when needed
- Individual developers can enable mocks for their workflow
- Clear indication when mocks are active

## Troubleshooting

### "Authentication failed" with real API mode

1. **Check if platform-api is running:**
   ```bash
   curl http://localhost:5000/health
   ```

2. **Verify API URL in `.env.local`:**
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:5000/
   ```

3. **Check platform-api logs** for authentication errors

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
npm run auth:mock  # or npm run auth:real
npm run dev        # Restart with new mode
```

## Technical Details

### How It Works

1. **Environment Variable Check**: `NEXT_PUBLIC_USE_MOCK_AUTH`
2. **MSW Initialization**: Only starts if mock mode is enabled
3. **Request Interception**: MSW intercepts API calls in mock mode
4. **Transparent Proxy**: Real mode proxies to platform-api

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

**Real API Mode:**
```
🔧 Authentication Configuration:
   Mode: real-api
   API URL: http://localhost:5000/
   🔗 Using real platform-api
   💡 Set NEXT_PUBLIC_USE_MOCK_AUTH=true to use mocks
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