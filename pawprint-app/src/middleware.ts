import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if there is any session token (NextAuth uses these cookies)
  const sessionToken = request.cookies.get('next-auth.session-token') || 
                       request.cookies.get('__Secure-next-auth.session-token')

  // If the user is trying to access the dashboard or report-lost page without a token
  if (!sessionToken && (request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/report-lost'))) {
    // Redirect them to the login page
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If the user is trying to access login/register while already logged in
  if (sessionToken && (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register'))) {
    // Redirect them to the dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/report-lost/:path*',
    '/login',
    '/register'
  ],
}
