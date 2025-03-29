"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { Location } from "@/utils/types";

// すべてのロケーションを取得
export async function getAllLocations(): Promise<Location[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("locations").select("*");
  if (error) throw new Error(error.message);
  return data;
}

// 指定の地域と市区町村に一致するロケーションを取得
export async function getLocationByRegionAndCity(
  region: string,
  city: string
): Promise<Location | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .eq("region", region)
    .eq("city", city);

  if (error) throw new Error(error.message);
  if (!data || data.length === 0) return null;

  return data[0]; // 最初の1件だけ返す
}

// ロケーションを新規追加
export async function insertLocation(
  location: Omit<Location, "id" | "created_at">
): Promise<Location> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("locations")
    .insert(location)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}
