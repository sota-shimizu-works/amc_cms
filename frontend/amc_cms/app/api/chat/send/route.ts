import { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { ChatLog } from "@/utils/types";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    query,
    is_admin = false,
    session_id = null,
    conversation_id, // ← クライアントから受け取る
  } = body;

  console.log("🟡 受け取ったリクエスト body:", body);

  const baseUrl = process.env.DIFY_API_BASE_URL || "http://localhost";
  const apiUrl = `${baseUrl}/chat-messages`;
  const apiKey = process.env.DIFY_API_KEY;

  const supabase = await createClient();

  // 管理者ならログインユーザーのIDを取得
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const user_id = is_admin ? user?.id || null : null;

  const difyRequestBody = {
    inputs: {},
    query,
    response_mode: "streaming",
    user: user_id || session_id || "anonymous",
    conversation_id: conversation_id ?? undefined, // ← 追加
  };

  console.log(
    "🟢 Dify に送信するデータ:",
    JSON.stringify(difyRequestBody, null, 2)
  );
  console.log("🔵 API URL:", apiUrl);

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(difyRequestBody),
  });

  console.log("🔴 Dify からのレスポンスステータス:", response.status);
  if (!response.ok || !response.body) {
    const errorText = await response.text();
    console.error("❌ Dify レスポンスエラー:", errorText);
    return new Response("Dify API Error", { status: response.status });
  }

  // --- ストリーム処理しながら全文を保持 ---
  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");

  let fullAnswer = "";
  let conversationId: string | null = conversation_id || null;

  const stream = new ReadableStream({
    async start(controller) {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        controller.enqueue(value); // クライアントに送信

        const lines = chunk
          .split("\n")
          .filter((line) => line.startsWith("data: "));

        for (const line of lines) {
          const jsonStr = line.replace("data: ", "");
          if (!jsonStr || jsonStr === "[DONE]") continue;

          try {
            const parsed = JSON.parse(jsonStr);
            const answer = parsed?.answer;
            if (answer) fullAnswer += answer;
            if (!conversationId) conversationId = parsed?.conversation_id;
          } catch (err) {
            console.warn("JSON parse error:", err);
          }
        }
      }

      // --- ストリーム完了後に保存 ---
      const { error } = await supabase.from("chat_logs").insert<ChatLog>({
        id: randomUUID(),
        user_id,
        session_id,
        is_admin,
        conversation_id: conversationId ?? "unknown",
        query,
        answer: fullAnswer,
        created_at: new Date().toISOString(),
      });

      if (error) {
        console.error("❌ Supabase 保存エラー:", error);
      } else {
        console.log("✅ チャットログ保存完了");
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
