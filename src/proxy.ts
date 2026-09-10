import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "anannt_session";
const SITE_ORIGIN = "https://study.anannt.ae";
const SUBJECT_SLUG = "physics-1";

const PUBLIC_EXACT = new Set([
  "/",
  "/about",
  "/faq",
  "/privacy",
  "/legal",
  "/diagnostic",
  "/course",
]);

const PUBLIC_LESSONS = new Set([
  "/lesson/lesson-motion-graphs",
  "/lesson/lesson-zero-v-a",
]);

function isPublic(pathname: string): boolean {
  if (PUBLIC_EXACT.has(pathname)) return true;
  if (PUBLIC_LESSONS.has(pathname)) return true;
  if (pathname.startsWith("/repair/")) return true;
  if (pathname.startsWith("/api/events")) return true;
  if (pathname.startsWith("/api/score")) return true;
  if (pathname.startsWith("/api/items")) return true;
  if (pathname.startsWith("/opengraph-image")) return true;
  if (pathname === "/icon" || pathname.startsWith("/icon/")) return true;
  if (pathname.startsWith("/apple-icon")) return true;
  if (pathname === "/manifest.webmanifest" || pathname === "/manifest") return true;
  if (pathname === "/robots.txt" || pathname === "/sitemap.xml") return true;
  return false;
}

function startUrl(unit = ""): string {
  const url = new URL(`${SITE_ORIGIN}/start`);
  url.searchParams.set("subject", SUBJECT_SLUG);
  url.searchParams.set("unit", unit);
  return url.toString();
}

function unitFromPath(pathname: string): string {
  if (pathname.startsWith("/lesson")) return "u1";
  if (pathname.startsWith("/practice")) return "practice";
  if (pathname.startsWith("/frq")) return "frq";
  if (pathname.startsWith("/mock")) return "mock";
  return "";
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (isPublic(pathname)) return NextResponse.next();

  const session = request.cookies.get(SESSION_COOKIE)?.value;
  if (session) return NextResponse.next();

  return NextResponse.redirect(startUrl(unitFromPath(pathname)));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)", "/"],
};
