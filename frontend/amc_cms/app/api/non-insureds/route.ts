import { NextRequest, NextResponse } from "next/server";
import {
  insertNonInsured,
  selectNonInsureds,
} from "@/app/(authed-page)/non-insured/actions";

export async function GET(req: NextRequest) {
  const data = await selectNonInsureds();

  if (!data) {
    return NextResponse.json(
      { error: "自費診療の一覧の取得に失敗しました" },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const result = await insertNonInsured(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "自費診療の登録に失敗しました" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    message: "自費診療の登録に成功しました",
    id: result.id,
  });
}
