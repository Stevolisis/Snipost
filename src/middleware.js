// middleware.js (in project root)
import { NextResponse } from 'next/server'

export function middleware(request) {
  const path = request.nextUrl.pathname

  // Redirect root path to /start
  if (path === '/') {
    return NextResponse.redirect(new URL('/start', request.url))
  }

  return NextResponse.next()
}

// Only run middleware on root path
export const config = {
  matcher: ['/']
}