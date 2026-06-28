import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Only these routes require authentication — everything else is public
const isProtectedRoute = createRouteMatcher([
  "/orders(.*)",
  "/api/orders(.*)",
  '/admin(.*)'
]);

export default clerkMiddleware(async (auth, request) => {
  if (isProtectedRoute(request) && ( await auth()).sessionClaims?.metadata?.role !== 'admin') {
    const url = new URL('/', request.url);
    return NextResponse.redirect(url);
  }

});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
