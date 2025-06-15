export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { selectArticle } from "@/app/(authed-page)/article/actions";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const idNumber = Number(id);
  if (isNaN(idNumber)) {
    return NextResponse.json({ error: "無効なIDです" }, { status: 400 });
  }

  const article = await selectArticle(idNumber);

  if (!article) {
    return NextResponse.json(
      { error: "記事が見つかりません" },
      { status: 404 }
    );
  }

  return NextResponse.json(article);
}
