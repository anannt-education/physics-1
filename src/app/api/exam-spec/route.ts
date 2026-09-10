import { NextResponse } from "next/server";
import { EXAM_SPEC } from "@/content/exam-spec";

export async function GET() {
  return NextResponse.json({ ok: true, spec: EXAM_SPEC });
}
