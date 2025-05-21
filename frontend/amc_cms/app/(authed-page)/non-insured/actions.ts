"use server";

import { createClient } from "@/utils/supabase/server";
import {
  NonInsured,
  NonInsuredTest,
  NonInsuredInformation,
} from "@/utils/types";

/**
 * Non-insureds
 */

export const selectNonInsureds = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("non_insured").select("*");

  if (error) {
    console.error("Error getting non-insureds", error);
    return;
  }

  return data as NonInsured[];
};

export const insertNonInsured = async (
  data: Omit<NonInsured, "id" | "created_at">
) => {
  const supabase = await createClient();

  const { data: inserted, error } = await supabase
    .from("non_insured")
    .insert([data])
    .select("id")
    .single();

  if (error) {
    console.error("Non-insured registration failed", error);
    return { success: false, error };
  }

  return { success: true, id: inserted.id };
};

export const selectNonInsured = async (
  id: number
): Promise<NonInsured | undefined> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("non_insured")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error getting non-insured", error);
    return;
  }

  return data as NonInsured;
};

export const selectNonInsuredBySlug = async (
  slug: string
): Promise<NonInsured | undefined> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("non_insured")
    .select("*, non_insured_test(*, test(*)), non_insured_information(*)")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error getting non-insured by slug", error);
    return;
  }

  return data as NonInsured;
};

export const updateNonInsured = async (
  id: number,
  data: Partial<Omit<NonInsured, "id" | "created_at">>
) => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("non_insured")
    .update(data)
    .eq("id", id);

  if (error) {
    console.error("Non-insured update failed", error);
    return { success: false, error };
  }

  return { success: true };
};

export const deleteNonInsured = async (id: number) => {
  const supabase = await createClient();

  const { error } = await supabase.from("non_insured").delete().eq("id", id);

  if (error) {
    console.error("Non-insured deletion failed", error);
    return { success: false, error };
  }

  return { success: true };
};

/**
 * Non-insured tests
 * @description If an non-insured ID provided, it will be used to filter the tests.
 */

export const selectNonInsuredTests = async (
  nonInsuredId?: number
): Promise<NonInsuredTest[] | undefined> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("non_insured_test")
    .select("*, test(*)")
    .eq("non_insured_id", nonInsuredId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error getting non-insured tests", error);
    return;
  }

  return data as NonInsuredTest[];
};

export const selectNonInsuredTest = async (
  id: number
): Promise<NonInsuredTest | undefined> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("non_insured_test")
    .select("*, test(*)")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error getting non-insured test", error);
    return;
  }

  return data as NonInsuredTest;
};

export const insertNonInsuredTest = async (
  data: Omit<NonInsuredTest, "id" | "created_at">
) => {
  const supabase = await createClient();

  const { data: inserted, error } = await supabase
    .from("non_insured_test")
    .insert([data])
    .select("id")
    .single();

  if (error) {
    console.error("Non-insured test registration failed", error);
    return { success: false, error };
  }

  return { success: true, id: inserted.id };
};

export const updateNonInsuredTest = async (
  id: number,
  data: Partial<Omit<NonInsuredTest, "id" | "created_at">>
) => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("non_insured_test")
    .update(data)
    .eq("id", id);

  if (error) {
    console.error("Non-insured test update failed", error);
    return { success: false, error };
  }

  return { success: true };
};

export const deleteNonInsuredTest = async (id: number) => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("non_insured_test")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Non-insured test deletion failed", error);
    return { success: false, error };
  }

  return { success: true };
};

/**
 * Non-insured information
 * @description 自費診療の告知情報
 */

export const selectNonInsuredInformations = async (
  nonInsuredId?: number
): Promise<NonInsuredInformation[] | undefined> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("non_insured_information")
    .select("*")
    .eq("non_insured_id", nonInsuredId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error getting non-insured information", error);
    return;
  }

  return data as NonInsuredInformation[];
};

export const selectNonInsuredInformation = async (
  id: number
): Promise<NonInsuredInformation | undefined> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("non_insured_information")
    .select("*, non_insured_information(*)")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error getting non-insured information", error);
    return;
  }

  return data as NonInsuredInformation;
};

export const insertNonInsuredInformation = async (
  data: Omit<NonInsuredInformation, "id" | "created_at">
) => {
  const supabase = await createClient();

  const { data: inserted, error } = await supabase
    .from("non_insured_information")
    .insert([data])
    .select("id")
    .single();

  if (error) {
    console.error("Non-insured information registration failed", error);
    return { success: false, error };
  }

  return { success: true, id: inserted.id };
};

export const updateNonInsuredInformation = async (
  id: number,
  data: Partial<Omit<NonInsuredInformation, "id" | "created_at">>
) => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("non_insured_information")
    .update(data)
    .eq("id", id);

  if (error) {
    console.error("Non-insured information update failed", error);
    return { success: false, error };
  }

  return { success: true };
};

export const deleteNonInsuredInformation = async (id: number) => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("non_insured_information")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Non-insured information deletion failed", error);
    return { success: false, error };
  }

  return { success: true };
};
