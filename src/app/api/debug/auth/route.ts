import { auth } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const session = await auth()
  
  return NextResponse.json({
    isAuthenticated: !!session?.user,
    session: session ? {
      user: session.user,
      expires: session.expires,
    } : null,
    cookies: request.cookies.getAll(),
    headers: Object.fromEntries(request.headers.entries()),
  })
}