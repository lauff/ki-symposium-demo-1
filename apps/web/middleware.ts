import { auth } from "./lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  if (pathname.startsWith("/citizen") && session?.user) {
    const role = (session.user as { role?: string }).role;
    if (role !== "CITIZEN") {
      return NextResponse.redirect(new URL("/volunteer/dashboard", req.url));
    }
  }

  if (pathname.startsWith("/volunteer") && session?.user) {
    const role = (session.user as { role?: string }).role;
    if (role !== "VOLUNTEER") {
      return NextResponse.redirect(new URL("/citizen/requests", req.url));
    }
  }

  if (
    (pathname.startsWith("/citizen") || pathname.startsWith("/volunteer")) &&
    !session?.user
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/citizen/:path*", "/volunteer/:path*"],
};
