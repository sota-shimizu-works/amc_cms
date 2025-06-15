import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

// 認証を除外したいルートとメソッドのリスト
const excludedRoutes: { path: string; method: string }[] = [
  { path: "/api/insureds", method: "GET" },
  { path: "/api/tests", method: "GET" },
  { path: "/api/non-insureds", method: "GET" },
  { path: "/api/insured-tests", method: "GET" },
  { path: "/api/non-insured-tests", method: "GET" },
  { path: "/api/insured-by-slug", method: "GET" },
  { path: "/api/non-insured-by-slug", method: "GET" },
  { path: "/api/test-by-slug", method: "GET" },
  { path: "/api/rag/search", method: "ALL" },
  { path: "/api/articles", method: "GET" },
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  const isExcluded = excludedRoutes.some(({ path, method: allowedMethod }) => {
    const isPathMatch = pathname === path || pathname.startsWith(`${path}/`);
    const isMethodMatch = allowedMethod === "ALL" || allowedMethod === method;
    return isPathMatch && isMethodMatch;
  });

  if (isExcluded) {
    return NextResponse.next();
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
