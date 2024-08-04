import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("token")?.value || "";

  console.log(`Path: ${path}, Token: ${token}`);

  // Allow access to public paths if no token is present
  const isPublicPath = path === "/login" || path === "/signup" || path === "/resetpassword" || path === "/verifyemail";
  if (isPublicPath && !token) {
    console.log("Allowing public path without token");
    return NextResponse.next();
  }

  // If the user has a token and is trying to access public paths (except for /verifyemail and /resetpassword), redirect to home
  if (token && (path === "/login" || path === "/signup")) {
    console.log("Redirecting authenticated user from login/signup to home");
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  // Allow access to /verifyemail and /resetpassword even if the user is not logged in
  if (path === "/verifyemail" || path === "/resetpassword") {
    console.log("Allowing access to /verifyemail or /resetpassword");
    return NextResponse.next();
  }

  // Redirect to login if accessing protected paths without a token
  if (!isPublicPath && !token) {
    console.log("Redirecting to login for protected paths without token");
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  // Default case, allow access
  return NextResponse.next();
}


export const config = {
  matcher: [
    "/",
    "/profile",
    "/login",
    "/signup",
    "/verifyemail",
    "/resetpassword",
  ],
};
