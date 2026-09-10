import { NextResponse } from "next/server";
import { ITEM_BANK, toPublicItem } from "@/content/items";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pool = searchParams.get("pool");
  const ids = searchParams.get("ids");
  let items = ITEM_BANK.filter((i) => i.publicationState === "published");
  if (pool) items = items.filter((i) => i.exposurePool === pool);
  if (ids) {
    const set = new Set(ids.split(","));
    items = items.filter((i) => set.has(i.id));
  }
  return NextResponse.json({
    ok: true,
    items: items.map(toPublicItem),
  });
}
