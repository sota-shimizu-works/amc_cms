import { NextRequest, NextResponse } from "next/server";
import {
  selectPageCustomFields,
  upsertPageCustomFields,
} from "@/app/(authed-page)/page/actions";
import { createClient } from "@/utils/supabase/server";

// ✅ オプション：動的レンダリングを明示（必須ではないが同じに合わせるならあり）
export const dynamic = "force-dynamic";

// ----------- GET ----------
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const pageId = Number(id);

  if (isNaN(pageId)) {
    return NextResponse.json({ error: "IDが無効です" }, { status: 400 });
  }

  const data = await selectPageCustomFields(pageId);

  if (!data) {
    return NextResponse.json(
      { error: "カスタムフィールドの取得に失敗しました" },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}

// ----------- POST ----------
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const pageId = Number(id);

  const body = await req.json();
  const { fields, deletedKeys } = body;

  if (!Array.isArray(fields)) {
    return NextResponse.json(
      { error: "配列形式で送信してください" },
      { status: 400 }
    );
  }

  // 🔥 削除処理追加
  if (Array.isArray(deletedKeys) && deletedKeys.length > 0) {
    const supabase = await createClient(); // 必要なら `actions.ts` に移してもOK
    await supabase
      .from("page_custom_field_values")
      .delete()
      .eq("page_id", pageId)
      .in("field_key", deletedKeys);
  }

  const result = await upsertPageCustomFields(pageId, fields);

  if (!result.success) {
    return NextResponse.json(
      { error: "カスタムフィールドの保存に失敗しました" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
