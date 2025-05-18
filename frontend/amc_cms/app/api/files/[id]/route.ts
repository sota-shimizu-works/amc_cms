export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import {
  deleteFile,
  selectFile,
  updateFile,
} from "@/app/(authed-page)/file/actions";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const idNumber = Number(id);
  if (isNaN(idNumber)) {
    return NextResponse.json({ error: "無効なIDです" }, { status: 400 });
  }

  const file = await selectFile(idNumber);

  if (!file) {
    return NextResponse.json(
      { error: "ファイルが見つかりません" },
      { status: 404 }
    );
  }

  return NextResponse.json(file);
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
  const result = await updateFile(idNumber, body);

  if (!result) {
    return NextResponse.json(
      { error: "ファイルの更新に失敗しました" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "ファイルの更新に成功しました" });
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

  const result = await deleteFile(idNumber);

  if (!result) {
    return NextResponse.json(
      { error: "ファイルの削除に失敗しました" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "ファイルの削除に成功しました" });
}
