import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const STUDY_ORIGIN = "https://study.anannt.ae";
const SUBJECT = "physics-1";
const COOKIE = "anannt_study_session";
const PUBLIC_LESSONS = new Set(["lesson-motion-graphs", "lesson-zero-v-a"]);

function startUrl(unit = "") {
  const url = new URL("/start", STUDY_ORIGIN);
  url.searchParams.set("subject", SUBJECT);
  url.searchParams.set("unit", unit);
  return url;
}

function isPublicPath(pathname: string) {
  if (pathname === "/" || pathname === "") return true;
  if (
    pathname === "/about" ||
    pathname === "/legal" ||
    pathname === "/course" ||
    pathname === "/diagnostic"
  ) {
    return true;
  }
  if (pathname.startsWith("/repair/")) return true;
  if (pathname.startsWith("/api/") && !pathname.startsWith("/api/admin")) return true;
  const lesson = pathname.match(/^\/lesson\/([^/]+)$/);
  if (lesson && PUBLIC_LESSONS.has(lesson[1])) return true;
  return false;
}

function unitFromPath(pathname: string) {
  const lesson = pathname.match(/^\/lesson\/([^/]+)$/);
  if (lesson) return lesson[1];
  return pathname.replace(/^\//, "").split("/")[0] ?? "";
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (request.nextUrl.searchParams.get("unlocked") === "1") {
    const res = NextResponse.next();
    res.cookies.set(COOKIE, "1", {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  }

  if (isPublicPath(pathname)) return NextResponse.next();
  if (request.cookies.get(COOKIE)?.value) return NextResponse.next();
  return NextResponse.redirect(startUrl(unitFromPath(pathname)));
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon|apple-icon|opengraph-image|twitter-image|sitemap.xml|robots.txt).*)",
  ],
};
