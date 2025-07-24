// app/api/logout/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Create response
    const response = NextResponse.json(
      { message: 'Logged out successfully' }, 
      { status: 200 }
    )

    // Delete the token cookie by setting it to expire
    response.cookies.set('token', '', {
      path: '/',
      expires: new Date(0),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    })

    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Logout failed' }, 
      { status: 500 }
    )
  }
}

// Also handle GET requests (in case someone visits /api/logout directly)
export async function GET(request: NextRequest) {
  try {
    // Redirect to home page after clearing cookie
    const response = NextResponse.redirect(new URL('/', request.url))

    // Delete the token cookie
    response.cookies.set('token', '', {
      path: '/',
      expires: new Date(0),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    })

    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.redirect(new URL('/', request.url))
  }
}
