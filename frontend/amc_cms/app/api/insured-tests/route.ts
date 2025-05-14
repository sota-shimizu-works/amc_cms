import { NextRequest, NextResponse } from "next/server";
import {
  insertInsuredTest,
  selectInsuredTests,
} from "@/app/(authed-page)/insured/actions";

/**
 *
 * @param req
 * @returns
 * @description 保険診療対象の検査一覧を取得する
 * @example GET /api/insured-tests?insured_id=1
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const insured_id = searchParams.get("insured_id");

  if (!insured_id) {
    return NextResponse.json(
      { error: "保険診療IDが指定されていません" },
      { status: 400 }
    );
  }

  const insuredTests = await selectInsuredTests(Number(insured_id));

  if (!insuredTests) {
    return NextResponse.json(
      { error: "保険適用検査の取得に失敗しました" },
      { status: 500 }
    );
  }

  return NextResponse.json(insuredTests);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = await insertInsuredTest(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "保険適用検査の登録に失敗しました" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    message: "保険適用検査の登録に成功しました",
    id: result.id,
  });
}
