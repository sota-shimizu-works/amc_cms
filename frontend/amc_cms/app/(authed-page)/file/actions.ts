"use server";

import { createClient } from "@/utils/supabase/server";
import { File } from "@/utils/types";

export const selectFiles = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("file").select("*");

  if (error) {
    console.error("Error getting files", error);
    return;
  }

  return data as File[];
};

export const insertFile = async (data: Omit<File, "id" | "created_at">) => {
  const supabase = await createClient();

  const { data: inserted, error } = await supabase
    .from("file")
    .insert([data])
    .select("id")
    .single();

  if (error) {
    console.error("ファイル登録に失敗しました", error);
    return { success: false, error };
  }

  return { success: true, id: inserted.id };
};

export const selectFile = async (id: number): Promise<File | undefined> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("file")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error getting file", error);
    return;
  }

  return data as File;
};

export const selectFileByType = async (
  type: string
): Promise<File | undefined> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("file")
    .select("*")
    .eq("type", type)
    .single();

  if (error) {
    console.error("Error getting file", error);
    return;
  }

  return data as File;
};

export const updateFile = async (
  id: number,
  data: Partial<Omit<File, "id" | "created_at">>
) => {
  const supabase = await createClient();
  const { error } = await supabase.from("file").update(data).eq("id", id);

  if (error) {
    console.error("Error updating file", error);
    return;
  }

  return { success: true };
};

export const deleteFile = async (id: number) => {
  const supabase = await createClient();
  const { error } = await supabase.from("file").delete().eq("id", id);

  if (error) {
    console.error("Error deleting file", error);
    return;
  }

  return { success: true };
};
