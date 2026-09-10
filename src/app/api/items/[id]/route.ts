import { NextResponse } from "next/server";
import { getItem, toPublicItem } from "@/content/items";
import { solutionFor } from "@/lib/scoring";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const item = getItem(id);
  if (!item) {
    return NextResponse.json({ ok: false, error: "Item not found." }, { status: 404 });
  }
  const { searchParams } = new URL(request.url);
  const reveal = searchParams.get("solution") === "1";
  return NextResponse.json({
    ok: true,
    item: toPublicItem(item),
    solution: reveal ? solutionFor(item) : undefined,
  });
}
