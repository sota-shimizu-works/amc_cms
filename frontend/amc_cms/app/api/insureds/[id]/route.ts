export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import {
  deleteInsured,
  selectInsured,
  updateInsured,
} from "@/app/(authed-page)/insured/actions";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const idNumber = Number(id);
  if (isNaN(idNumber)) {
    return NextResponse.json({ error: "無効なIDです" }, { status: 400 });
  }

  const insured = await selectInsured(idNumber);

  if (!insured) {
    return NextResponse.json(
      { error: "被保険者が見つかりません" },
      { status: 404 }
    );
  }

  return NextResponse.json(insured);
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
  const result = await updateInsured(idNumber, body);

  if (!result.success) {
    return NextResponse.json(
      { error: "被保険者の更新に失敗しました" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "被保険者の更新に成功しました" });
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

  const result = await deleteInsured(idNumber);

  if (!result.success) {
    return NextResponse.json(
      { error: "被保険者の削除に失敗しました" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "被保険者の削除に成功しました" });
}
