export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import {
  selectTestReport,
  deleteTestReport,
  updateTestReport,
} from "@/app/(authed-page)/test/actions";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const idNumber = Number(id);
  if (isNaN(idNumber)) {
    return NextResponse.json({ error: "無効なIDです" }, { status: 400 });
  }

  const testReport = await selectTestReport(idNumber);

  if (!testReport) {
    return NextResponse.json(
      { error: "検査レポートが見つかりません" },
      { status: 404 }
    );
  }

  return NextResponse.json(testReport);
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const idNumber = Number(id);

  if (isNaN(idNumber)) {
    return NextResponse.json({ error: "無効なIDです" }, { status: 400 });
  }

  const body = await req.json();
  const result = await updateTestReport(idNumber, body);

  if (!result.success) {
    return NextResponse.json(
      { error: "検査レポートの更新に失敗しました" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "検査レポートの更新に成功しました" });
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const idNumber = Number(id);

  if (isNaN(idNumber)) {
    return NextResponse.json({ error: "無効なIDです" }, { status: 400 });
  }

  const result = await deleteTestReport(idNumber);

  if (!result.success) {
    return NextResponse.json(
      { error: "検査レポートの削除に失敗しました" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "検査レポートの削除に成功しました" });
}
