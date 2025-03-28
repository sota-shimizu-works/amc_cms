export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import {
  selectPage,
  updatePage,
  deletePage,
} from "@/app/(authed-page)/page/actions";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const idNumber = Number(id);
  if (isNaN(idNumber)) {
    return NextResponse.json({ error: "無効なIDです" }, { status: 400 });
  }

  const page = await selectPage(idNumber);

  if (!page) {
    return NextResponse.json(
      { error: "ページが見つかりません" },
      { status: 404 }
    );
  }

  return NextResponse.json(page);
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
  const result = await updatePage(idNumber, body);

  if (!result.success) {
    return NextResponse.json(
      { error: "ページの更新に失敗しました" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "ページの更新に成功しました" });
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

  const result = await deletePage(idNumber);

  if (!result.success) {
    return NextResponse.json(
      { error: "ページの削除に失敗しました" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "ページの削除に成功しました" });
}
