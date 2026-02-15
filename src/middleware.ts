import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 1. Definisikan rute yang HARUS login (Protected)
const isProtectedRoute = createRouteMatcher([
  '/admin(.*)',
  '/my-books(.*)',
  '/profile(.*)'
]);

// 2. Definisikan rute yang BENAR-BENAR publik (termasuk Webhook)
const isPublicRoute = createRouteMatcher([
  '/',
  '/api/webhooks(.*)', 
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/search(.*)',
  '/book(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
  // Jika rute adalah Protected DAN bukan Public, maka lindungi
  if (isProtectedRoute(req) && !isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};