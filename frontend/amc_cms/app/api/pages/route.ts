import { NextRequest, NextResponse } from "next/server";
import { insertPage, selectPages } from "@/app/(authed-page)/page/actions";

export async function GET(req: NextRequest) {
  const data = await selectPages();

  if (!data) {
    return NextResponse.json(
      { error: "ページ一覧の取得に失敗しました" },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const result = await insertPage(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "ページ登録に失敗しました" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    message: "ページの登録に成功しました",
    id: result.id,
  });
}
