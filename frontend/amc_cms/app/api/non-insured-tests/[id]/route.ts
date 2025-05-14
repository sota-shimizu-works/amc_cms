export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import {
  deleteNonInsuredTest,
  selectNonInsuredTest,
  updateNonInsuredTest,
} from "@/app/(authed-page)/non-insured/actions";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const idNumber = Number(id);
  if (isNaN(idNumber)) {
    return NextResponse.json({ error: "無効なIDです" }, { status: 400 });
  }

  const nonInsuredTest = await selectNonInsuredTest(idNumber);

  if (!nonInsuredTest) {
    return NextResponse.json(
      { error: "自費診療検査が見つかりません" },
      { status: 404 }
    );
  }

  return NextResponse.json(nonInsuredTest);
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
  const result = await updateNonInsuredTest(idNumber, body);

  if (!result.success) {
    return NextResponse.json(
      { error: "自費診療検査の更新に失敗しました" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "自費診療検査の更新に成功しました" });
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

  const result = await deleteNonInsuredTest(idNumber);

  if (!result.success) {
    return NextResponse.json(
      { error: "自費診療検査の削除に失敗しました" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "自費診療検査の削除に成功しました" });
}
