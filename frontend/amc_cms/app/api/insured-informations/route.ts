import { NextRequest, NextResponse } from "next/server";
import {
  selectInsuredInformations,
  insertInsuredInformation,
} from "@/app/(authed-page)/insured/actions";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const insured_id = searchParams.get("insured_id");

  if (!insured_id) {
    return NextResponse.json(
      { error: "保険診療IDが指定されていません" },
      { status: 400 }
    );
  }

  const data = await selectInsuredInformations(Number(insured_id));

  if (!data) {
    return NextResponse.json(
      { error: "保険診療告知の取得に失敗しました" },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const result = await insertInsuredInformation(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "保険診療告知の登録に失敗しました" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    message: "保険診療告知の登録に成功しました",
    id: result.id,
  });
}
