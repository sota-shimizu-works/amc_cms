export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import {
  deleteTest,
  selectTest,
  updateTest,
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

  const test = await selectTest(idNumber);

  if (!test) {
    return NextResponse.json(
      { error: "テストが見つかりません" },
      { status: 404 }
    );
  }

  return NextResponse.json(test);
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
  const result = await updateTest(idNumber, body);

  if (!result.success) {
    return NextResponse.json(
      { error: "テストの更新に失敗しました" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "テストの更新に成功しました" });
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

  const result = await deleteTest(idNumber);

  if (!result.success) {
    return NextResponse.json(
      { error: "テストの削除に失敗しました" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "テストの削除に成功しました" });
}
