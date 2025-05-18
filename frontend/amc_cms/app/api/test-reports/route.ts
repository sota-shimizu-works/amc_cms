import { NextRequest, NextResponse } from "next/server";
import {
  selectTestReports,
  insertTestReport,
} from "@/app/(authed-page)/test/actions";

/**
 * @description 検査レポートを取得する
 * @param req
 * @example GET /api/test-reports?test_id=1
 */

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const test_id = searchParams.get("test_id");

  if (!test_id) {
    return NextResponse.json(
      { error: "検査IDが指定されていません" },
      { status: 400 }
    );
  }

  const testReports = await selectTestReports(Number(test_id));

  if (!testReports) {
    return NextResponse.json(
      { error: "検査レポートの取得に失敗しました" },
      { status: 500 }
    );
  }

  return NextResponse.json(testReports);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = await insertTestReport(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "検査レポートの登録に失敗しました" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    message: "検査レポートの登録に成功しました",
    id: result.id,
  });
}
