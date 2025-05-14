import { NextRequest, NextResponse } from "next/server";
import {
  insertInsured,
  selectInsureds,
} from "@/app/(authed-page)/insured/actions";

export async function GET(req: NextRequest) {
  const data = await selectInsureds();

  if (!data) {
    return NextResponse.json(
      { error: "被保険者一覧の取得に失敗しました" },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const result = await insertInsured(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "被保険者登録に失敗しました" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    message: "被保険者の登録に成功しました",
    id: result.id,
  });
}
