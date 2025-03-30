import { NextRequest, NextResponse } from "next/server";
import {
  selectKnowledge,
  updateKnowledge,
  deleteKnowledge,
} from "@/app/(authed-page)/knowledge/actions";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const knowledge = await selectKnowledge(id);
  if (!knowledge) {
    return NextResponse.json(
      { error: "ナレッジが見つかりません" },
      { status: 404 }
    );
  }

  return NextResponse.json(knowledge);
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await req.json();

  const result = await updateKnowledge(id, body);
  if (!result.success) {
    return NextResponse.json({ error: "更新に失敗しました" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const result = await deleteKnowledge(id);
  if (!result.success) {
    return NextResponse.json({ error: "削除に失敗しました" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
