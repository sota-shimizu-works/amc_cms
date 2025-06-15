import { NextRequest, NextResponse } from "next/server";
import { selectArticlesWithPagination } from "@/app/(authed-page)/article/actions";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  // クエリから page/perPage を取得（数値に変換）
  const page = Number(searchParams.get("page")) || 1;
  const perPage = Number(searchParams.get("perPage")) || 10;

  // 任意：更新日時でソートするか（クエリに ?order=updated で渡す想定）
  const orderByUpdate = searchParams.get("order") === "updated";

  const result = await selectArticlesWithPagination(
    orderByUpdate,
    page,
    perPage
  );

  if (!result || !result.data) {
    return NextResponse.json(
      { error: "記事一覧の取得に失敗しました" },
      { status: 500 }
    );
  }

  return NextResponse.json(result);
}
