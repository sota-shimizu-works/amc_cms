export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import {
  deleteInsuredPatient,
  selectInsuredPatient,
  updateInsuredPatient,
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

  const insuredPatient = await selectInsuredPatient(idNumber);

  if (!insuredPatient) {
    return NextResponse.json(
      { error: "保険診療対象が見つかりません" },
      { status: 404 }
    );
  }

  return NextResponse.json(insuredPatient);
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
  const result = await updateInsuredPatient(idNumber, body);

  if (!result.success) {
    return NextResponse.json(
      { error: "保険診療対象の更新に失敗しました" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "保険診療対象の更新に成功しました" });
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

  const result = await deleteInsuredPatient(idNumber);

  if (!result.success) {
    return NextResponse.json(
      { error: "保険診療対象の削除に失敗しました" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "保険診療対象の削除に成功しました" });
}
