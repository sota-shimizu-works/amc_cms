import { NextRequest } from "next/server";
import {
  insertKnowledge,
  selectKnowledgeList,
} from "@/app/(authed-page)/knowledge/actions";

// GET: ナレッジ一覧取得
export async function GET() {
  const data = await selectKnowledgeList();
  return Response.json(data);
}

// POST: ナレッジ新規登録
export async function POST(req: NextRequest) {
  console.log("POST /api/knowledge");
  const body = await req.json();
  const { title, content, category, metadata } = body;

  if (!title || !content || !category) {
    return new Response("Missing required fields", { status: 400 });
  }

  const result = await insertKnowledge({
    title,
    content,
    category,
    metadata: metadata ?? null,
  });

  if (!result.success || !result.id) {
    return new Response("Failed to insert knowledge", { status: 500 });
  }

  console.log("🆕 登録成功", result.id);

  // 🔁 登録成功 → embedding生成
  const embeddingRes = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/embedding`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: result.id, content }),
    }
  );

  console.log("🧠 embeddingRes", embeddingRes);

  if (!embeddingRes.ok) {
    console.error("❌ Embedding生成に失敗");
    return new Response("Failed to generate embedding", { status: 500 });
  }

  return Response.json({ success: true, id: result.id });
}
