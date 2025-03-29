import { NextRequest, NextResponse } from "next/server";
import { selectUnreadCount } from "@/app/(authed-page)/contact/actions";

export async function GET() {
  const result = await selectUnreadCount();

  if (result === 0 || !result.success) {
    return NextResponse.json(
      { error: "お問い合わせ情報の取得に失敗しました" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    message: "お問い合わせ情報の取得に成功しました",
    success: true,
    data: result.data,
  });
}
