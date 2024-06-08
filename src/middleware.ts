import { clerkMiddleware, ClerkMiddlewareOptions } from "@clerk/nextjs/server";


export default clerkMiddleware({
  publicRoutes: ["/"]
} as ClerkMiddlewareOptions);


export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
  // matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}