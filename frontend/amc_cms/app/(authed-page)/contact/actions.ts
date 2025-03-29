"use server";

import { createClient } from "@/utils/supabase/server";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const selectContacts = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contact")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching contacts", error);
    return [];
  }

  return data;
};

export const selectContact = async (contactId: number) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contact")
    .select("*")
    .eq("id", contactId)
    .single();

  if (error) {
    console.error("Error fetching contact", error);
    return null;
  }

  return data;
};

export const updateRead = async (contactId: number, isRead: boolean) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contact")
    .update({ is_read: isRead })
    .eq("id", contactId);

  if (error) {
    console.error("Error updating contact", error);
    return;
  }

  return data;
};

export const selectUnreadCount = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contact")
    .select("*")
    .eq("is_read", false);

  if (error) {
    console.error("Error fetching unread count", error);
    return 0;
  }
  return { success: true, data: data };
};
