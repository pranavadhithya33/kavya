import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const userId = request.cookies.get('medconnect_user_id')?.value
  const role = request.cookies.get('medconnect_role')?.value

  // Public routes
  if (pathname === '/' || pathname.startsWith('/login') || pathname.startsWith('/register')) {
    if (userId && role) {
      if (role === 'admin') return NextResponse.redirect(new URL('/admin/dashboard', request.url))
      if (role === 'doctor') return NextResponse.redirect(new URL('/doctor/dashboard', request.url))
      return NextResponse.redirect(new URL('/patient/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // Protected routes - require auth
  if (!userId || !role) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Role-based access control
  if (pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  if (pathname.startsWith('/doctor') && role !== 'doctor') {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  if (pathname.startsWith('/patient') && role !== 'patient') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\.png$).*)'],
}
