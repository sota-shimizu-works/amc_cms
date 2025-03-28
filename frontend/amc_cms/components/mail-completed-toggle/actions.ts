"use server";

import { createClient } from "@/utils/supabase/server";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

export const updateCompleted = async (
  contactId: number,
  isCompleted: boolean
) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contact")
    .update({ is_completed: isCompleted })
    .eq("id", contactId);

  if (error) {
    console.error("Error updating contact", error);
    return;
  }

  return data;
};
