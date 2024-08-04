import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === "/login" || path === "/signup";
  const token = request.cookies.get("token")?.value || "";
  const email = path === "/verifyemail";
  const resetpage = path === "/resetpassword";

  if (isPublicPath && !token) {
    return NextResponse.next();
  }

  if (isPublicPath && token) {
    if (email) {
      return NextResponse.redirect(new URL("/verifyemail", request.nextUrl));
    }
    if(resetpage)
    {
      return NextResponse.redirect(new URL("/resetpassword"))
    }
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }
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
