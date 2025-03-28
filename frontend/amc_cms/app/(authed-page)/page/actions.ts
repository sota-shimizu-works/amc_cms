"use server";

import { createClient } from "@/utils/supabase/server";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);
import { Page, PageCategory, PageBase } from "@/utils/types";

export const selectPages = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("page")
    .select("*, page_category(*)");

  if (error) {
    console.error("Error getting pages", error);
    return;
  }

  return data as Page[];
};

export const insertPage = async (data: Omit<PageBase, "id" | "created_at">) => {
  const supabase = await createClient();

  const { data: inserted, error } = await supabase
    .from("page")
    .insert([data])
    .select("id")
    .single();

  if (error) {
    console.error("ページ登録に失敗しました", error);
    return { success: false, error };
  }

  return { success: true, id: inserted.id };
};

export const selectPage = async (id: number): Promise<Page | undefined> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("page")
    .select("*, page_category(*)")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error getting page", error);
    return;
  }

  return data as Page;
};

export const updatePage = async (
  id: number,
  data: Partial<Omit<PageBase, "id">>
) => {
  const supabase = await createClient();

  const { error } = await supabase.from("page").update(data).eq("id", id);

  if (error) {
    console.error("ページ更新に失敗しました", error);
    return { success: false, error };
  }

  return { success: true };
};

export const deletePage = async (id: number) => {
  const supabase = await createClient();

  const { error } = await supabase.from("page").delete().eq("id", id);

  if (error) {
    console.error("ページ削除に失敗しました", error);
    return { success: false, error };
  }

  return { success: true };
};

export const selectPageCategories = async (): Promise<
  PageCategory[] | undefined
> => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("page_category").select("*");

  if (error) {
    console.error("Error getting page categories", error);
    return;
  }

  return data as PageCategory[];
};
