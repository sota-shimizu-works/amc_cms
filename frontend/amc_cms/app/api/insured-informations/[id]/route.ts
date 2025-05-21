export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import {
  deleteInsuredInformation,
  selectInsuredInformation,
  updateInsuredInformation,
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

  const insuredInformation = await selectInsuredInformation(idNumber);

  if (!insuredInformation) {
    return NextResponse.json(
      { error: "保険診療告知が見つかりません" },
      { status: 404 }
    );
  }

  return NextResponse.json(insuredInformation);
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
  const result = await updateInsuredInformation(idNumber, body);

  if (!result.success) {
    return NextResponse.json(
      { error: "保険診療告知の更新に失敗しました" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "保険診療告知の更新に成功しました" });
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

  const result = await deleteInsuredInformation(idNumber);

  if (!result.success) {
    return NextResponse.json(
      { error: "保険診療告知の削除に失敗しました" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "保険診療告知の削除に成功しました" });
}
