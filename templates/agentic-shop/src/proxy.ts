import { NextResponse, type NextRequest } from "next/server";
import { isValidSession, OPS_COOKIE } from "@/lib/ops-auth";

// Protects the owner panel. Server actions on /ops also re-check the session.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/ops/login") return NextResponse.next();

  if (!isValidSession(request.cookies.get(OPS_COOKIE)?.value)) {
    return NextResponse.redirect(new URL("/ops/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/ops", "/ops/:path*"],
};
