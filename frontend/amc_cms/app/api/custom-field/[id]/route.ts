import { NextRequest, NextResponse } from "next/server";
import {
  selectCustomField,
  updateCustomField,
  deleteCustomField,
} from "@/app/(authed-page)/custom-field/actions";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const idNumber = Number(id);

  if (isNaN(idNumber)) {
    return NextResponse.json({ error: "無効なIDです" }, { status: 400 });
  }

  const customField = await selectCustomField(String(idNumber));
  if (!customField) {
    return NextResponse.json(
      { error: "カスタムフィールドが見つかりません" },
      { status: 404 }
    );
  }

  return NextResponse.json(customField);
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const idNumber = Number(id);

  if (isNaN(idNumber)) {
    return NextResponse.json({ error: "無効なIDです" }, { status: 400 });
  }

  const body = await req.json();
  const result = await updateCustomField(idNumber, body);

  if (!result.success) {
    return NextResponse.json(
      { error: "カスタムフィールドの更新に失敗しました" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
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

  const result = await deleteCustomField(idNumber);
  if (!result.success) {
    return NextResponse.json(
      { error: "カスタムフィールドの削除に失敗しました" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
