"use server";

import { createClient } from "@/utils/supabase/server";
import {
  Insured,
  InsuredPatient,
  InsuredTest,
  NonInsuredInformation,
} from "@/utils/types";

/**
 *
 * @returns Promise<Insured[] | undefined>
 * @description 保険診療対象の一覧を取得する
 */

export const selectInsureds = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("insured").select("*");

  if (error) {
    console.error("Error getting insureds", error);
    return;
  }

  return data as Insured[];
};

export const insertInsured = async (
  data: Omit<Insured, "id" | "created_at">
) => {
  const supabase = await createClient();

  const { data: inserted, error } = await supabase
    .from("insured")
    .insert([data])
    .select("id")
    .single();

  if (error) {
    console.error("Insured registration failed", error);
    return { success: false, error };
  }

  return { success: true, id: inserted.id };
};

export const selectInsured = async (
  id: number
): Promise<Insured | undefined> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("insured")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error getting insured", error);
    return;
  }

  return data as Insured;
};

export const selectInsuredBySlug = async (
  slug: string
): Promise<Insured | undefined> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("insured")
    .select("*, insured_patient(*), insured_test(*, test(*))")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error getting insured by slug", error);
    return;
  }

  return data as Insured;
};

export const updateInsured = async (
  id: number,
  data: Partial<Omit<Insured, "id">>
) => {
  const supabase = await createClient();

  const { error } = await supabase.from("insured").update(data).eq("id", id);

  if (error) {
    console.error("Insured update failed", error);
    return { success: false, error };
  }

  return { success: true };
};

export const deleteInsured = async (id: number) => {
  const supabase = await createClient();

  const { error } = await supabase.from("insured").delete().eq("id", id);

  if (error) {
    console.error("Insured deletion failed", error);
    return { success: false, error };
  }

  return { success: true };
};

/**
 *
 * @param insured_id
 * @returns Promise<InsuredPatient[] | undefined>
 * @description 保険診療対象の患者一覧を取得する
 */

export const selectInsuredPatients = async (
  insured_id: number
): Promise<InsuredPatient[] | undefined> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("insured_patient")
    .select("*")
    .eq("insured_id", insured_id);

  if (error) {
    console.error("Error getting insured patients", error);
    return;
  }

  return data as InsuredPatient[];
};

export const insertInsuredPatient = async (
  data: Omit<InsuredPatient, "id" | "created_at">
) => {
  const supabase = await createClient();

  const { data: inserted, error } = await supabase
    .from("insured_patient")
    .insert([data])
    .select("id")
    .single();

  if (error) {
    console.error("Insured patient registration failed", error);
    return { success: false, error };
  }

  return { success: true, id: inserted.id };
};

export const selectInsuredPatient = async (
  id: number
): Promise<InsuredPatient | undefined> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("insured_patient")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error getting insured patient", error);
    return;
  }

  return data as InsuredPatient;
};

export const updateInsuredPatient = async (
  id: number,
  data: Partial<Omit<InsuredPatient, "id">>
) => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("insured_patient")
    .update(data)
    .eq("id", id);

  if (error) {
    console.error("Insured patient update failed", error);
    return { success: false, error };
  }

  return { success: true };
};

export const deleteInsuredPatient = async (id: number) => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("insured_patient")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Insured patient deletion failed", error);
    return { success: false, error };
  }

  return { success: true };
};

/**
 *
 * @param insured_id
 * @description 保険診療対象の検査一覧を取得する
 */

export const selectInsuredTests = async (
  insured_id: number
): Promise<InsuredTest[] | undefined> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("insured_test")
    .select("*,test(*),insured(*)")
    .eq("insured_id", insured_id);

  if (error) {
    console.error("Error getting insured tests", error);
    return;
  }

  return data as InsuredTest[];
};

export const insertInsuredTest = async (
  data: Omit<InsuredTest, "id" | "created_at">
) => {
  const supabase = await createClient();

  const { data: inserted, error } = await supabase
    .from("insured_test")
    .insert([data])
    .select("id")
    .single();

  if (error) {
    console.error("Insured test registration failed", error);
    return { success: false, error };
  }

  return { success: true, id: inserted.id };
};

export const selectInsuredTest = async (
  id: number
): Promise<InsuredTest | undefined> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("insured_test")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error getting insured test", error);
    return;
  }

  return data as InsuredTest;
};

export const updateInsuredTest = async (
  id: number,
  data: Partial<Omit<InsuredTest, "id">>
) => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("insured_test")
    .update(data)
    .eq("id", id);

  if (error) {
    console.error("Insured test update failed", error);
    return { success: false, error };
  }

  return { success: true };
};

export const deleteInsuredTest = async (id: number) => {
  const supabase = await createClient();

  const { error } = await supabase.from("insured_test").delete().eq("id", id);

  if (error) {
    console.error("Insured test deletion failed", error);
    return { success: false, error };
  }

  return { success: true };
};

/**
 * @param insured_id
 * @description 保険診療の告知情報を取得する
 */

export const selectInsuredInformations = async (
  insured_id: number
): Promise<NonInsuredInformation[] | undefined> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("insured_information")
    .select("*, insured(*)")
    .eq("insured_id", insured_id);

  if (error) {
    console.error("Error getting insured information", error);
    return;
  }

  return data as NonInsuredInformation[];
};

export const selectInsuredInformation = async (
  id: number
): Promise<NonInsuredInformation | undefined> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("insured_information")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error getting insured information", error);
    return;
  }

  return data as NonInsuredInformation;
};

export const insertInsuredInformation = async (
  data: Omit<NonInsuredInformation, "id" | "created_at">
) => {
  const supabase = await createClient();

  const { data: inserted, error } = await supabase
    .from("insured_information")
    .insert([data])
    .select("id")
    .single();

  if (error) {
    console.error("Insured information registration failed", error);
    return { success: false, error };
  }

  return { success: true, id: inserted.id };
};

export const updateInsuredInformation = async (
  id: number,
  data: Partial<Omit<NonInsuredInformation, "id">>
) => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("insured_information")
    .update(data)
    .eq("id", id);

  if (error) {
    console.error("Insured information update failed", error);
    return { success: false, error };
  }

  return { success: true };
};

export const deleteInsuredInformation = async (id: number) => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("insured_information")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Insured information deletion failed", error);
    return { success: false, error };
  }

  return { success: true };
};
