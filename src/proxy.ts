import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  GATED_PREFIXES,
  LESSON_3,
  PUBLIC_REPAIR_PREFIX,
  SESSION_COOKIE,
  gateHref,
  isPublicLessonPath,
} from "@/lib/mount";

function unitFromPath(pathname: string) {
  if (pathname === LESSON_3.path || pathname.startsWith(`${LESSON_3.path}/`)) return LESSON_3.unit;
  if (pathname.startsWith("/lesson/")) return "u1";
  if (pathname.startsWith("/unit/")) return pathname.split("/")[2] ?? "";
  const parts = pathname.split("/").filter(Boolean);
  return parts[0] ?? "";
}

function isGated(pathname: string) {
  if (pathname === PUBLIC_REPAIR_PREFIX || pathname.startsWith(`${PUBLIC_REPAIR_PREFIX}/`)) {
    return false;
  }
  if (GATED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return true;
  }
  if (pathname.startsWith("/lesson/") && !isPublicLessonPath(pathname)) {
    return true;
  }
  return false;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (request.cookies.get(SESSION_COOKIE)?.value) {
    return NextResponse.next();
  }
  if (!isGated(pathname)) {
    return NextResponse.next();
  }
  return NextResponse.redirect(gateHref(unitFromPath(pathname)), 307);
}

export const config = {
  matcher: [
    "/onboarding",
    "/onboarding/:path*",
    "/practice",
    "/practice/:path*",
    "/frq",
    "/frq/:path*",
    "/mocks",
    "/mocks/:path*",
    "/progress",
    "/progress/:path*",
    "/results",
    "/results/:path*",
    "/review",
    "/review/:path*",
    "/admin",
    "/admin/:path*",
    "/lesson/:path*",
  ],
};
