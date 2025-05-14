export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { selectNonInsuredBySlug } from "@/app/(authed-page)/non-insured/actions";

/**
 * @description スラッグから自費診療を取得する
 * @example GET /api/non-insured-by-slug/slug
 */

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;

  const nonInsured = await selectNonInsuredBySlug(slug);

  if (!nonInsured) {
    return NextResponse.json(
      { error: "自費診療が見つかりません" },
      { status: 404 }
    );
  }

  return NextResponse.json(nonInsured);
}
