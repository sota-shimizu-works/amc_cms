// app/api/embedding/route.ts
import { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  console.log("POST /api/embedding");
  const body = await req.json();
  const { id, content } = body;

  if (!content || !id) {
    return new Response("Missing content or id", { status: 400 });
  }

  // OpenAIでembedding生成
  const embeddingRes = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "text-embedding-3-small",
      input: content,
    }),
  });

  const embeddingData = await embeddingRes.json();
  console.log("🧠 embeddingData", embeddingData);
  const embedding = embeddingData.data?.[0]?.embedding;

  if (!embedding) {
    console.error("❌ embeddingが取得できませんでした");
    return new Response("Embedding failed", { status: 500 });
  }

  console.log("💾 保存対象ID:", id);
  console.log("💾 保存するembedding（先頭5要素）:", embedding.slice(0, 5));

  const supabase = await createClient();
  const { error } = await supabase
    .from("knowledge")
    .update({ embedding })
    .eq("id", id);

  if (error) {
    console.error("❌ Supabaseへのembedding保存エラー:", error);
    return new Response("Failed to save embedding", { status: 500 });
  }

  console.log("✅ embedding保存完了");

  return new Response("Embedding saved", { status: 200 });
}
