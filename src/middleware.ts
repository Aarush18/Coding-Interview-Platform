import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // Adjust this based on which routes need auth
    "/((?!_next/static|_next/image|favicon.ico|.*\\.svg$).*)",
  ],
};
