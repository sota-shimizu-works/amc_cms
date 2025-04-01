import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();

  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("category_id");

  const query = supabase.from("custom_field_definitions").select("*");

  if (categoryId) {
    query.eq("page_category_id", categoryId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("カスタムフィールド定義取得失敗", error);
    return NextResponse.json({ error: "取得に失敗しました" }, { status: 500 });
  }

  return NextResponse.json(data);
}
