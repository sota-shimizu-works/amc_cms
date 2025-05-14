"use server";

import { createClient } from "@/utils/supabase/server";
import { Test } from "@/utils/types";

export const selectTests = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("test").select("*");

  if (error) {
    console.error("Error getting tests", error);
    return;
  }

  return data as Test[];
};

export const insertTest = async (data: Omit<Test, "id" | "created_at">) => {
  const supabase = await createClient();

  const { data: inserted, error } = await supabase
    .from("test")
    .insert([data])
    .select("id")
    .single();

  if (error) {
    console.error("テスト登録に失敗しました", error);
    return { success: false, error };
  }

  return { success: true, id: inserted.id };
};

export const selectTest = async (id: number): Promise<Test | undefined> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("test")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error getting test", error);
    return;
  }

  return data as Test;
};

export const selectTestBySlug = async (
  slug: string
): Promise<Test | undefined> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("test")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error getting test by slug", error);
    return;
  }

  return data as Test;
};

export const updateTest = async (
  id: number,
  data: Partial<Omit<Test, "id">>
) => {
  const supabase = await createClient();

  const { error } = await supabase.from("test").update(data).eq("id", id);

  if (error) {
    console.error("テスト更新に失敗しました", error);
    return { success: false, error };
  }

  return { success: true };
};

export const deleteTest = async (id: number) => {
  const supabase = await createClient();

  const { error } = await supabase.from("test").delete().eq("id", id);

  if (error) {
    console.error("テスト削除に失敗しました", error);
    return { success: false, error };
  }

  return { success: true };
};
