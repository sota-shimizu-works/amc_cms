"use server";

import { createClient } from "@/utils/supabase/server";
import { CustomFieldDefinition, PageCategory } from "@/utils/types";

// 📥 一覧取得（新しい順）
export const selectCustomFieldList = async (): Promise<
  (CustomFieldDefinition & { page_category: PageCategory | null })[]
> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("custom_field_definitions")
    .select("*, page_category(*)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("カスタムフィールド一覧の取得に失敗しました", error);
    return [];
  }

  return data.map((field) => ({
    ...field,
    page_category: field.page_category ?? null,
  }));
};

// 📘 単体取得
export const selectCustomField = async (
  id: string
): Promise<CustomFieldDefinition | null> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("custom_field_definitions")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("カスタムフィールドの取得に失敗しました", error);
    return null;
  }

  return data;
};

// 🆕 登録
export const insertCustomField = async (
  data: Omit<CustomFieldDefinition, "id" | "created_at">
): Promise<{ success: boolean; id?: number }> => {
  const supabase = await createClient();

  const { data: inserted, error } = await supabase
    .from("custom_field_definitions")
    .insert([data])
    .select("id")
    .single();

  if (error) {
    console.error("カスタムフィールドの登録に失敗しました", error);
    return { success: false };
  }

  return { success: true, id: inserted.id };
};

// ✏️ 更新
export const updateCustomField = async (
  id: number,
  data: Partial<Omit<CustomFieldDefinition, "id" | "created_at">>
): Promise<{ success: boolean }> => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("custom_field_definitions")
    .update(data)
    .eq("id", id);

  if (error) {
    console.error("カスタムフィールドの更新に失敗しました", error);
    return { success: false };
  }

  return { success: true };
};

// 🗑 削除
export const deleteCustomField = async (
  id: number
): Promise<{ success: boolean }> => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("custom_field_definitions")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("カスタムフィールドの削除に失敗しました", error);
    return { success: false };
  }

  return { success: true };
};
