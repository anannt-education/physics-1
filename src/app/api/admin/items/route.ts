import { NextResponse } from "next/server";
import { ITEM_BANK } from "@/content/items";

export async function GET() {
  return NextResponse.json({
    ok: true,
    items: ITEM_BANK.map((i) => ({
      id: i.id,
      version: i.version,
      prompt: i.prompt,
      type: i.type,
      exposurePool: i.exposurePool,
      publicationState: i.publicationState,
      authorId: i.authorId,
      reviewerId: i.reviewerId,
      familyId: i.familyId,
      unitId: i.unitId,
      correctChoiceId: i.correctChoiceId,
      solution: i.solution,
    })),
  });
}
