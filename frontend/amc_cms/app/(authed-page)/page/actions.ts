"use server";

import { createClient } from "@/utils/supabase/server";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);
import {
  Page,
  PageCategory,
  PageBase,
  PageCustomFieldValue,
  CustomFieldDefinition,
} from "@/utils/types";

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

/**
 * 指定ページIDに紐づくカスタムフィールド値と定義を取得
 */
export const selectPageCustomFields = async (
  pageId: number
): Promise<
  (PageCustomFieldValue & { definition: CustomFieldDefinition })[] | undefined
> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("page_custom_field_values")
    .select("*, custom_field_definitions(*)")
    .eq("page_id", pageId);

  if (error) {
    console.error("カスタムフィールド取得に失敗しました", error);
    return;
  }

  return data.map((item) => ({
    id: item.id,
    page_id: item.page_id,
    field_key: item.field_key,
    value: item.value,
    sort_order: item.sort_order,
    created_at: item.created_at,
    definition: item.custom_field_definitions,
  }));
};

/**
 * 指定ページIDに対するカスタムフィールド値を upsert（まとめて更新）
 */
type CustomFieldUpsertPayload = {
  field_key: string;
  value: any;
  sort_order?: number;
};

export const upsertPageCustomFields = async (
  pageId: number,
  values: CustomFieldUpsertPayload[]
): Promise<{ success: boolean }> => {
  const supabase = await createClient();

  const upsertData = values.map((item) => ({
    page_id: pageId,
    field_key: item.field_key,
    value: item.value,
    sort_order: item.sort_order ?? 0,
  }));

  const { error } = await supabase
    .from("page_custom_field_values")
    .upsert(upsertData, {
      onConflict: "page_id,field_key,sort_order",
    });

  if (error) {
    console.error("カスタムフィールド保存に失敗しました", error);
    return { success: false };
  }

  return { success: true };
};
