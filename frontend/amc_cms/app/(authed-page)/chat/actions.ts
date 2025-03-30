"use server";

import { createClient } from "@/utils/supabase/server";
import { ChatLog } from "@/utils/types";

// 会話一覧：conversation_idごとに最新のログを1件ずつ取得
export const selectConversations = async (): Promise<ChatLog[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("chat_logs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("会話一覧の取得に失敗しました", error);
    return [];
  }

  // conversation_id ごとに最新1件だけを残す
  const seen = new Set<string>();
  const unique = data.filter((log) => {
    if (seen.has(log.conversation_id)) return false;
    seen.add(log.conversation_id);
    return true;
  });

  return unique;
};

// 会話詳細：指定の conversation_id に属するチャットログ一覧を取得
export const selectConversationLogs = async (
  conversation_id: string
): Promise<ChatLog[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("chat_logs")
    .select("*")
    .eq("conversation_id", conversation_id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("会話ログの取得に失敗しました", error);
    return [];
  }

  return data;
};

// チャットログの削除（特定のconversation_idごと削除）
export const deleteConversation = async (conversation_id: string) => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("chat_logs")
    .delete()
    .eq("conversation_id", conversation_id);

  if (error) {
    console.error("チャットログの削除に失敗しました", error);
    return { success: false, error };
  }

  return { success: true };
};
