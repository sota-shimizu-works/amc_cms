import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 認証スキップしたいAPIルートを明示的に除外
  if (pathname === "/api/rag/search") {
    return NextResponse.next();
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    // APIルート /api/rag/search を除外するように正規表現を追加
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api/rag/search).*)",
  ],
};
