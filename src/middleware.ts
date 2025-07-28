import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from "@/lib/auth"
import { getTestPagesConfig, isTestPage } from "@/lib/test-pages-config"

// Security headers for all responses
function addSecurityHeaders(response: NextResponse) {
  // Content Security Policy
  response.headers.set('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https:; " +
    "frame-ancestors 'none'; " +
    "base-uri 'self';"
  )
  
  // Other security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // HTTPS enforcement in production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  }
  
  return response
}

export default auth((req) => {
  const { pathname } = req.nextUrl
  const testPageCheck = isTestPage(pathname)
  const config = getTestPagesConfig()
  
  // Block test pages in non-local environments
  if (testPageCheck && !config.allowAccess) {
    const response = NextResponse.redirect(new URL('/404', req.url))
    return addSecurityHeaders(response)
  }
  
  // Allow test pages in local development (bypass auth)
  if (testPageCheck && config.allowAccess) {
    const response = NextResponse.next()
    return addSecurityHeaders(response)
  }
  
  // Regular auth flow for other pages
  const isAuthenticated = !!req.auth?.user
  const isAuthPage = pathname.startsWith('/auth')
  const isApiRoute = pathname.startsWith('/api')
  
  // Allow API routes to handle their own auth
  if (isApiRoute) {
    const response = NextResponse.next()
    return addSecurityHeaders(response)
  }
  
  // Check for token refresh errors
  if (req.auth?.error === 'RefreshAccessTokenError') {
    const response = NextResponse.redirect(new URL('/auth/signin?error=TokenExpired', req.url))
    return addSecurityHeaders(response)
  }
  
  // Redirect unauthenticated users to sign in
  if (!isAuthenticated && !isAuthPage) {
    const response = NextResponse.redirect(new URL('/auth/signin', req.url))
    return addSecurityHeaders(response)
  }
  
  // Redirect authenticated users away from auth pages
  if (isAuthenticated && isAuthPage && pathname !== '/auth/signout') {
    const response = NextResponse.redirect(new URL('/', req.url))
    return addSecurityHeaders(response)
  }
  
  // Add tenant context to headers for OIDC flows
  if (isAuthenticated && req.auth?.user) {
    const response = NextResponse.next()
    response.headers.set('x-tenant-id', String(req.auth.user.primaryTenantId || 0))
    response.headers.set('x-user-id', req.auth.user.id || '')
    response.headers.set('x-auth-type', req.auth.user.authType || 'unknown')
    return addSecurityHeaders(response)
  }
  
  const response = NextResponse.next()
  return addSecurityHeaders(response)
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}