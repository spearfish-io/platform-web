import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from "@/lib/auth"
import { getTestPagesConfig, isTestPage } from "@/lib/test-pages-config"

export default auth((req) => {
  const { pathname } = req.nextUrl
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
  
  // Regular auth flow for other pages
  const isAuthenticated = !!req.auth?.user
  const isAuthPage = pathname.startsWith('/auth')
  
  if (!isAuthenticated && !isAuthPage) {
    return NextResponse.redirect(new URL('/auth/signin', req.url))
  }
  
  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL('/', req.url))
  }
  
  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}