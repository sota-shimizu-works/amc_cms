"use server";

import { createClient } from "@/utils/supabase/server";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const selectCategories = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("category")
    .select("*, article_category(*, article(*))");

  if (error) {
    console.error("Error getting categories", error);
    return;
  }

  return data;
};

export const selectCategory = async (id: number) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("category")
    .select("*, article_category(*, article(*))")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error getting category", error);
    return;
  }

  return data;
};
