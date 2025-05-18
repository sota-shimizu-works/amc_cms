import { NextRequest, NextResponse } from "next/server";
import { insertFile, selectFiles } from "@/app/(authed-page)/file/actions";

export async function GET(req: NextRequest) {
  const data = await selectFiles();

  if (!data) {
    return NextResponse.json(
      { error: "ファイル一覧の取得に失敗しました" },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const result = await insertFile(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "ファイル登録に失敗しました" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    message: "ファイルの登録に成功しました",
    id: result.id,
  });
}
