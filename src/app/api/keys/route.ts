import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/mount";

export async function GET() {
  const jar = await cookies();
  const session = jar.get(SESSION_COOKIE)?.value;
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "Session required" },
      { status: 401, headers: { "X-Robots-Tag": "noindex, nofollow" } },
    );
  }
  return NextResponse.json(
    { ok: true, keys: [] },
    { headers: { "X-Robots-Tag": "noindex, nofollow" } },
  );
}
