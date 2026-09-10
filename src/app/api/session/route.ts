import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/gate";

/** Session cookie for gated routes. Keys stay server-side via /api/score. */
export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "1", {
    path: "/",
    sameSite: "lax",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}

export async function GET() {
  return POST();
}
