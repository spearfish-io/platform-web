import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

/**
 * Transcripts API Route
 * 
 * Proxies transcript requests to the backend API server with proper cookie forwarding
 */
export async function GET(request: NextRequest) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || ''
    const { searchParams } = request.nextUrl
    
    // Construct backend URL with query parameters
    const backendUrl = new URL(`${baseUrl}/api/transcripts`)
    searchParams.forEach((value, key) => {
      backendUrl.searchParams.set(key, value)
    })
    
    console.log('🔥 Proxying transcripts request to:', backendUrl.toString())
    
    // Get cookies using the portal-spearfish pattern
    const cookieStore = await cookies()
    const cookieHeader = cookieStore.toString()
    
    console.log('🍪 Forwarding cookies:', cookieHeader ? 'Yes' : 'No cookies')
    
    const response = await fetch(backendUrl.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Cookie': cookieHeader,
      },
      // Don't use credentials: 'include' since we're manually handling cookies
    })
    
    console.log('🔥 Backend response:', response.status, response.statusText)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('🔥 Transcripts API error:', response.status, errorText)
      
      return NextResponse.json(
        { 
          error: 'Failed to fetch transcripts',
          status: response.status,
          message: errorText || response.statusText
        },
        { status: response.status }
      )
    }
    
    const data = await response.json()
    console.log('🔥 Transcripts fetched successfully:', {
      totalCount: data.metadata?.totalCount || 0,
      currentPage: data.metadata?.currentPage || 1
    })
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('🔥 Transcripts API error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    )
  }
}

/**
 * Get transcript by ID
 */
export async function POST(request: NextRequest) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || ''
    const body = await request.json()
    
    console.log('🔥 Creating transcript via proxy')
    
    // Get cookies using the portal-spearfish pattern
    const cookieStore = await cookies()
    const cookieHeader = cookieStore.toString()
    
    const response = await fetch(`${baseUrl}/api/transcripts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': cookieHeader,
      },
      body: JSON.stringify(body),
    })
    
    console.log('🔥 Backend response:', response.status, response.statusText)
    
    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { 
          error: 'Failed to create transcript',
          status: response.status,
          message: errorText || response.statusText
        },
        { status: response.status }
      )
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('🔥 Create transcript error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    )
  }
}