"use server";

import { createClient } from "@/utils/supabase/server";
import { Knowledge } from "@/utils/types";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

// 📥 一覧取得（新しい順）
export const selectKnowledgeList = async (): Promise<Knowledge[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("knowledge")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("ナレッジ一覧の取得に失敗しました", error);
    return [];
  }

  return data;
};

// 📘 単体取得
export const selectKnowledge = async (
  id: string
): Promise<Knowledge | null> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("knowledge")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("ナレッジの取得に失敗しました", error);
    return null;
  }

  return data;
};

// 🆕 登録（embeddingはnullでOK）
export const insertKnowledge = async (
  data: Omit<Knowledge, "id" | "created_at" | "embedding">
): Promise<{ success: boolean; id?: string }> => {
  const supabase = await createClient();

  const { data: inserted, error } = await supabase
    .from("knowledge")
    .insert([{ ...data, embedding: null }])
    .select("id")
    .single();

  if (error) {
    console.error("ナレッジの登録に失敗しました", error);
    return { success: false };
  }

  return { success: true, id: inserted.id };
};

// ✏️ 更新（embeddingは編集しない）
export const updateKnowledge = async (
  id: string,
  data: Partial<Omit<Knowledge, "id" | "created_at" | "embedding">>
): Promise<{ success: boolean }> => {
  const supabase = await createClient();

  const { error } = await supabase.from("knowledge").update(data).eq("id", id);

  if (error) {
    console.error("ナレッジの更新に失敗しました", error);
    return { success: false };
  }

  return { success: true };
};

// 🗑 削除
export const deleteKnowledge = async (
  id: string
): Promise<{ success: boolean }> => {
  const supabase = await createClient();

  const { error } = await supabase.from("knowledge").delete().eq("id", id);

  if (error) {
    console.error("ナレッジの削除に失敗しました", error);
    return { success: false };
  }

  return { success: true };
};
