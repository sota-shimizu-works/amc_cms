import { NextRequest, NextResponse } from "next/server";
import { insertTest, selectTests } from "@/app/(authed-page)/test/actions";

export async function GET(req: NextRequest) {
  const data = await selectTests();

  if (!data) {
    return NextResponse.json(
      { error: "テスト一覧の取得に失敗しました" },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const result = await insertTest(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "テスト登録に失敗しました" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    message: "テストの登録に成功しました",
    id: result.id,
  });
}
