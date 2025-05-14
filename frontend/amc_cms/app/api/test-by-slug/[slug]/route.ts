export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { selectTestBySlug } from "@/app/(authed-page)/test/actions";

/**
 * @description スラッグからテストを取得する
 * @example GET /api/test-by-slug/slug
 */

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;

  const test = await selectTestBySlug(slug);

  if (!test) {
    return NextResponse.json(
      { error: "テストが見つかりません" },
      { status: 404 }
    );
  }

  return NextResponse.json(test);
}
