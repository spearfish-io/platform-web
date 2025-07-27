import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'

/**
 * OAuth Callback Route for Spearfish Provider
 * 
 * This route handles the OAuth 2.0 authorization code flow callback
 * from the Spearfish Identity API server.
 */
export async function GET(request: NextRequest) {
  // Auth.js will automatically handle the OAuth callback
  // This route exists to satisfy the redirect URI configuration
  return auth(request)
}

export async function POST(request: NextRequest) {
  // Handle POST callbacks if needed
  return auth(request)
}