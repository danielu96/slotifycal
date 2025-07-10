import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
    '/reservations(.*)',
    '/profile(.*)',

]);

export default clerkMiddleware((auth, req) => {
    if (isProtectedRoute(req)) auth();
});

export const config = {
    matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};