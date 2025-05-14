export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { selectInsuredBySlug } from "@/app/(authed-page)/insured/actions";

/**
 *
 * @description スラッグから保険診療を取得する
 * @example GET /api/insured-by-slug/slug
 */

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;

  const insured = await selectInsuredBySlug(slug);

  if (!insured) {
    return NextResponse.json(
      { error: "保険診療が見つかりません" },
      { status: 404 }
    );
  }

  return NextResponse.json(insured);
}
