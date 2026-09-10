import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { gateUrl, isGatedPath, unitForGate } from "@/lib/mount";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (isGatedPath(pathname)) {
    return NextResponse.redirect(gateUrl(unitForGate(pathname)));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|icon|apple-icon|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
