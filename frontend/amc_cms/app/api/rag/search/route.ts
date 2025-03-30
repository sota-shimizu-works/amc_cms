// app/api/retrieval/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(req: NextRequest) {
  return NextResponse.json({
    message: "✅ RAG search API is reachable (GET)",
  });
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  // 認証チェック（必要に応じてスキップしてもOK）
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      {
        error_code: 1001,
        error_msg:
          "Invalid Authorization header format. Expected 'Bearer ' format.",
      },
      { status: 403 }
    );
  }

  const { knowledge_id, query, retrieval_setting } = await req.json();

  if (!knowledge_id || !query || !retrieval_setting) {
    return NextResponse.json(
      {
        error_code: 2001,
        error_msg: "Missing knowledge_id, query, or retrieval_setting",
      },
      { status: 400 }
    );
  }

  const { top_k, score_threshold } = retrieval_setting;

  // OpenAI Embedding
  const embeddingRes = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "text-embedding-3-small",
      input: query,
    }),
  });

  const embeddingData = await embeddingRes.json();
  const vector = embeddingData.data?.[0]?.embedding;

  if (!vector) {
    return NextResponse.json(
      {
        error_code: 500,
        error_msg: "Failed to generate embedding.",
      },
      { status: 500 }
    );
  }

  const supabase = await createClient();

  const { data, error } = await supabase.rpc("match_knowledge", {
    query_embedding: vector,
    match_threshold: score_threshold ?? 0.75,
    match_count: top_k ?? 5,
  });

  if (error) {
    console.error("Supabase RPC Error:", error);
    return NextResponse.json(
      {
        error_code: 500,
        error_msg: "Similarity search failed.",
      },
      { status: 500 }
    );
  }

  const records = data.map((doc: any) => ({
    title: doc.title,
    content: doc.content,
    score: doc.score ?? 1,
    metadata: doc.metadata ?? {},
  }));

  return NextResponse.json({ records });
}
