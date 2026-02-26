import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/session';
import { cookies } from 'next/headers';

export async function middleware(request: NextRequest) {
    // 1. Check for session cookie
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;
    const payload = await decrypt(session);

    // 2. Define protected and public routes
    const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard');
    const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register');

    // 3. Redirect unauthenticated users trying to access protected routes
    if (isProtectedRoute && !payload) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 4. Redirect authenticated users away from auth routes
    if (isAuthRoute && payload) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // 5. RBAC: Example - Restrict specific admin routes if needed (Optional for now)
    // if (request.nextUrl.pathname.startsWith('/dashboard/admin') && payload?.role !== 'admin') {
    //   return NextResponse.redirect(new URL('/dashboard', request.url));
    // }

    return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
