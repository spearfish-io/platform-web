import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

/**
 * Analytics Overview API Route
 * 
 * Proxies analytics overview requests to the backend API server
 */
export async function GET(request: NextRequest) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || ''
    const { searchParams } = request.nextUrl
    
    // Construct backend URL with query parameters
    const backendUrl = new URL(`${baseUrl}/api/analytics/overview`)
    searchParams.forEach((value, key) => {
      backendUrl.searchParams.set(key, value)
    })
    
    console.log('🔥 Proxying analytics overview request to:', backendUrl.toString())
    
    // Get cookies using the portal-spearfish pattern
    const cookieStore = await cookies()
    const cookieHeader = cookieStore.toString()
    
    const response = await fetch(backendUrl.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Cookie': cookieHeader,
      },
    })
    
    console.log('🔥 Analytics overview response:', response.status, response.statusText)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('🔥 Analytics overview error:', response.status, errorText)
      
      return NextResponse.json(
        { 
          error: 'Failed to fetch analytics overview',
          status: response.status,
          message: errorText || response.statusText
        },
        { status: response.status }
      )
    }
    
    const data = await response.json()
    console.log('🔥 Analytics overview fetched successfully')
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('🔥 Analytics overview API error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    )
  }
}