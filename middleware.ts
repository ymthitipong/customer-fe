import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_PATHS = ['/login', '/customers']

function isAllowed(pathname: string): boolean {
  return ALLOWED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + '/'),
  )
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!isAllowed(pathname)) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all paths except Next.js internals and static files
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)).*)',
  ],
}
