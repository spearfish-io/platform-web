import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

/**
 * Current User API Route
 * 
 * Proxies current user requests to the backend API server
 */
export async function GET(request: NextRequest) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || ''
    
    console.log('🔥 Proxying current user request to:', `${baseUrl}/api/users/current`)
    
    // Get cookies using the portal-spearfish pattern
    const cookieStore = await cookies()
    const cookieHeader = cookieStore.toString()
    
    const response = await fetch(`${baseUrl}/api/users/current`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Cookie': cookieHeader,
      },
    })
    
    console.log('🔥 Current user response:', response.status, response.statusText)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('🔥 Current user error:', response.status, errorText)
      
      return NextResponse.json(
        { 
          error: 'Failed to fetch current user',
          status: response.status,
          message: errorText || response.statusText
        },
        { status: response.status }
      )
    }
    
    const data = await response.json()
    console.log('🔥 Current user fetched successfully')
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('🔥 Current user API error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    )
  }
}