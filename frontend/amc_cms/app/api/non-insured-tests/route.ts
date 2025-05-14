import { NextRequest, NextResponse } from "next/server";
import {
  insertNonInsuredTest,
  selectNonInsuredTests,
} from "@/app/(authed-page)/non-insured/actions";

/**
 *
 * @param req
 * @returns
 * @description 自費診療の検査一覧を取得する
 * @example GET /api/non-insured-tests?non_insured_id=1
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

  const nonInsuredTests = await selectNonInsuredTests(Number(non_insured_id));

  if (!nonInsuredTests) {
    return NextResponse.json(
      { error: "自費診療検査の取得に失敗しました" },
      { status: 500 }
    );
  }

  return NextResponse.json(nonInsuredTests);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = await insertNonInsuredTest(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "自費診療検査の登録に失敗しました" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    message: "自費診療検査の登録に成功しました",
    id: result.id,
  });
}
