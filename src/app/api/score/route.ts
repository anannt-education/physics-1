import { NextResponse } from "next/server";
import { getItem, toPublicItem } from "@/content/items";
import { scoreItem, solutionFor } from "@/lib/scoring";
import type { PublicationState, ScoreRequest } from "@/lib/types";

export async function POST(request: Request) {
  const idempotency = request.headers.get("Idempotency-Key") ?? crypto.randomUUID();
  let body: ScoreRequest & { revealSolution?: boolean; overrideState?: PublicationState };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, code: "bad_json", error: "Request body was not valid JSON." },
      { status: 400 }
    );
  }

  const item = getItem(body.itemId);
  if (!item) {
    return NextResponse.json(
      { ok: false, code: "unknown_item", error: "That question is not in the published bank." },
      { status: 404 }
    );
  }

  const pub = body.overrideState ?? item.publicationState;
  if (pub === "withdrawn") {
    return NextResponse.json(
      {
        ok: false,
        code: "withdrawn",
        withdrawn: true,
        error:
          "This item has been withdrawn. Prior attempts that pinned an earlier version are unchanged.",
      },
      { status: 410 }
    );
  }
  if (pub !== "published") {
    return NextResponse.json(
      { ok: false, code: "unpublished", error: "This item is not published for students." },
      { status: 403 }
    );
  }

  if (body.itemVersion !== item.version) {
    return NextResponse.json(
      {
        ok: false,
        code: "version_mismatch",
        error: "The attempt pinned a different item version. Scoring uses the pinned version only in a full CMS; this slice refuses the mismatch rather than silently re-keying.",
      },
      { status: 409 }
    );
  }

  const result = scoreItem(item, body.payload, body.firstAttempt);
  const acknowledgedAt = new Date().toISOString();

  return NextResponse.json({
    ok: true,
    result,
    acknowledgedAt,
    idempotencyKey: idempotency,
    publicItem: toPublicItem(item),
    solution: body.payload.solutionRevealed || body.revealSolution ? solutionFor(item) : undefined,
  });
}
