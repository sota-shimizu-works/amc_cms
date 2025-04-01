import { NextRequest, NextResponse } from "next/server";
import {
  insertCustomField,
  selectCustomFieldList,
} from "@/app/(authed-page)/custom-field/actions";

// GET: カスタムフィールド一覧取得
export async function GET() {
  const data = await selectCustomFieldList();
  return NextResponse.json(data);
}

// POST: カスタムフィールド新規登録
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { key, label, type, is_repeatable, options, page_category_id } = body;

  // 必須フィールドのバリデーション
  if (!key || !label || !type) {
    return NextResponse.json(
      { error: "必須フィールドが不足しています" },
      { status: 400 }
    );
  }

  // typeのバリデーション
  const validTypes = [
    "text",
    "textarea",
    "select",
    "checkbox",
    "radio",
    "date",
    "group",
  ];
  if (!validTypes.includes(type)) {
    return NextResponse.json(
      { error: "不正なフィールドタイプです" },
      { status: 400 }
    );
  }

  // page_category_idのバリデーション
  if (page_category_id !== null && typeof page_category_id !== "number") {
    return NextResponse.json(
      { error: "不正なページカテゴリIDです" },
      { status: 400 }
    );
  }

  const result = await insertCustomField({
    key,
    label,
    type,
    options: options ?? null,
    is_repeatable: is_repeatable ?? false,
    page_category_id: page_category_id ?? null,
  });

  if (!result.success) {
    return NextResponse.json(
      { error: "カスタムフィールドの登録に失敗しました" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, id: result.id });
}
