import { NextRequest, NextResponse } from "next/server";
import {
  selectNonInsuredInformations,
  insertNonInsuredInformation,
} from "@/app/(authed-page)/non-insured/actions";

/**
 * Non-insured information
 * @description 自費診療の告知情報
 * @example /api/non-insured-informations?non_insured_id=1
 */

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const non_insured_id = searchParams.get("non_insured_id");

  if (!non_insured_id) {
    return NextResponse.json(
      { error: "自費診療IDが指定されていません" },
      { status: 400 }
    );
  }

  const data = await selectNonInsuredInformations(Number(non_insured_id));

  if (!data) {
    return NextResponse.json(
      { error: "自費診療告知の取得に失敗しました" },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const result = await insertNonInsuredInformation(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "自費診療告知の登録に失敗しました" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    message: "自費診療告知の登録に成功しました",
    id: result.id,
  });
}
