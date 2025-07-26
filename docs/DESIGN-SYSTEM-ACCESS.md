# Design System Test Pages - Environment Access Control

This document explains how the Platform Web design system test pages are safely isolated to local development environments only.

## 🎯 **Objective**

Enable comprehensive design system documentation and testing tools that are:
- ✅ **Available in local development** for developers and designers
- ❌ **Completely blocked in Azure dev/prod** environments
- 🔒 **Never accessible to end users** in deployed environments

## 🛡️ **Security Implementation**

### 1. **Multi-Layer Protection**

#### **Layer 1: Middleware-Level Blocking**
```typescript
// src/middleware.ts
export default auth((req) => {
  const testPageCheck = isTestPage(pathname)
  const config = getTestPagesConfig()
  
  // Block test pages in non-local environments
  if (testPageCheck && !config.allowAccess) {
    return NextResponse.redirect(new URL('/404', req.url))
  }
  
  // Allow test pages in local development (bypass auth)
  if (testPageCheck && config.allowAccess) {
    return NextResponse.next()
  }
})
```

#### **Layer 2: Environment Detection**
```typescript
// src/lib/test-pages-config.ts
export function getTestPagesConfig(): TestPagesConfig {
  const nodeEnv = process.env.NODE_ENV;
  const isLocal = nodeEnv === 'development';
  const isAzure = !!(process.env.AZURE_CLIENT_ID || process.env.WEBSITE_SITE_NAME);
  const isVercelProd = process.env.VERCEL_ENV === 'production';
  
  // Only enable test pages in local development
  const enabled = isLocal && !isAzure;
  
  return {
    enabled,
    showInNavigation: enabled,
    allowAccess: enabled,
    environment: getEnvironmentName()
  };
}
```

#### **Layer 3: Navigation Hiding**
```typescript
// src/components/layout/sidebar.tsx
{testPagesConfig.showInNavigation && (
  <Box mt="6">
    <Text>Design System</Text>
    {/* Test page navigation items */}
  </Box>
)}
```

### 2. **Environment Detection Logic**

| Environment | Detection Method | Access Level |
|-------------|------------------|--------------|
| **Local Development** | `NODE_ENV === 'development'` | ✅ Full Access |
| **Azure Dev/Prod** | `AZURE_CLIENT_ID` or `WEBSITE_SITE_NAME` present | ❌ Blocked |
| **Vercel Production** | `VERCEL_ENV === 'production'` | ❌ Blocked |
| **Vercel Preview** | `VERCEL_ENV === 'preview'` | ❌ Blocked |

### 3. **Test Page Routes Protected**

```typescript
const TEST_PAGE_ROUTES = [
  '/design-system',
  '/components', 
  '/patterns',
  '/performance',
  '/accessibility',
  '/auth-demo'
] as const;
```

## 🔧 **How It Works**

### **In Local Development (`npm run dev`)**
1. ✅ Test pages are fully accessible
2. ✅ Navigation shows "Design System" section
3. ✅ No authentication required for test pages
4. ✅ Full functionality including Ladle integration

### **In Azure Environments**
1. ❌ Middleware blocks all test page routes
2. ❌ Navigation section hidden completely
3. ❌ Direct URL access redirects to 404
4. ❌ Custom 404 page explains restriction

### **In Production Deployments**
1. ❌ Same blocking behavior as Azure
2. ❌ No trace of test pages in production builds
3. ❌ SEO robots.txt can exclude test pages
4. ❌ Bundle optimization excludes test-only components

## 🧪 **Testing the Implementation**

### **Local Development Test**
```bash
npm run dev
# Navigate to http://localhost:3000/design-system
# Expected: ✅ Page loads successfully
```

### **Production Environment Test**
```bash
# Set environment variables to simulate Azure
export AZURE_CLIENT_ID="test-value"
export NODE_ENV="production"
npm run build && npm run start

# Navigate to http://localhost:3000/design-system  
# Expected: ❌ Redirects to 404 with explanation
```

### **Navigation Test**
```bash
# In local development
# Expected: ✅ "Design System" section visible in sidebar

# In production simulation
# Expected: ❌ "Design System" section hidden
```

## 📋 **Configuration Options**

### **Environment Variables**

| Variable | Purpose | Local | Azure | Production |
|----------|---------|-------|-------|------------|
| `NODE_ENV` | Environment type | `development` | `production` | `production` |
| `AZURE_CLIENT_ID` | Azure detection | `undefined` | `set` | `set` |
| `WEBSITE_SITE_NAME` | Azure App Service | `undefined` | `set` | `set` |
| `VERCEL_ENV` | Vercel environment | `undefined` | `preview/production` | `production` |

### **Configuration Response**
```typescript
interface TestPagesConfig {
  enabled: boolean;        // Are test pages enabled?
  showInNavigation: boolean; // Show in sidebar?
  allowAccess: boolean;    // Allow route access?
  environment: string;     // Environment name
}
```

## 🚨 **Fail-Safe Mechanisms**

### **1. Default Deny**
- If environment detection fails, defaults to **blocking access**
- Better to be overly restrictive than accidentally expose

### **2. Multiple Detection Methods**
- Uses multiple environment variables for detection
- Redundant checks prevent bypass scenarios

### **3. Custom Error Pages**
- Clear explanation of why access is blocked
- Helpful information for developers
- No confusing generic 404 messages

### **4. Debug Information**
- Development-only debug panel shows configuration
- Helps troubleshoot environment detection issues

## 📝 **Implementation Files**

| File | Purpose |
|------|---------|
| `src/lib/test-pages-config.ts` | Environment detection and configuration |
| `src/middleware.ts` | Route-level access control |
| `src/components/layout/sidebar.tsx` | Conditional navigation display |
| `src/app/not-found.tsx` | Custom 404 with test page messaging |

## ✅ **Security Checklist**

- [x] **Middleware blocks test pages in production**
- [x] **Environment detection covers Azure and Vercel**
- [x] **Navigation hidden in production environments**
- [x] **Custom 404 page explains restrictions**
- [x] **Multiple layers of protection**
- [x] **Default deny for unknown environments**
- [x] **Debug information available in development**
- [x] **No authentication bypass vulnerabilities**

## 🔄 **Deployment Verification**

After deploying to Azure dev/prod environments:

1. **Test direct URL access**: `/design-system` should redirect to 404
2. **Check navigation**: Design System section should not appear
3. **Verify 404 messaging**: Should explain test page restrictions
4. **Confirm environment detection**: Debug info should show correct environment

This multi-layer approach ensures the design system test pages provide excellent developer experience locally while maintaining complete security in production environments.