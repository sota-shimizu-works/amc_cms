import { NextResponse } from "next/server";
import { selectPageCategories } from "@/app/(authed-page)/page/actions";

export async function GET() {
  const categories = await selectPageCategories();

  if (!categories) {
    return NextResponse.json({ error: "取得に失敗しました" }, { status: 500 });
  }

  return NextResponse.json(categories);
}
