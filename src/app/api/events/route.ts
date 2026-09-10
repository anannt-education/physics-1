import { NextResponse } from "next/server";
import { EVENT_NAMES, SUBJECT_SLUG, type EventName } from "@/lib/mount";

export async function POST(request: Request) {
  let body: { name?: string } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const name = body.name as EventName | undefined;
  if (!name || !(EVENT_NAMES as readonly string[]).includes(name)) {
    return NextResponse.json({ ok: false, error: "Unknown event" }, { status: 400 });
  }
  console.info("[anannt-event]", SUBJECT_SLUG, name);
  return NextResponse.json({ ok: true });
}
