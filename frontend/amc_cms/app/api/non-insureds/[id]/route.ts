export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import {
  deleteNonInsured,
  selectNonInsured,
  updateNonInsured,
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

  const nonInsured = await selectNonInsured(idNumber);

  if (!nonInsured) {
    return NextResponse.json(
      { error: "自費診療が見つかりません" },
      { status: 404 }
    );
  }

  return NextResponse.json(nonInsured);
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
  const result = await updateNonInsured(idNumber, body);

  if (!result.success) {
    return NextResponse.json(
      { error: "自費診療の更新に失敗しました" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "自費診療の更新に成功しました" });
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

  const result = await deleteNonInsured(idNumber);

  if (!result.success) {
    return NextResponse.json(
      { error: "自費診療の削除に失敗しました" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "自費診療の削除に成功しました" });
}
