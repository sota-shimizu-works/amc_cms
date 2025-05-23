"use server";

import { createClient } from "@/utils/supabase/server";
import * as cheerio from "cheerio";
import { randomBytes } from "crypto";

type UploadFileResult = {
  url: string;
  path: string;
  size: number;
  type: string;
};

export const uploadImageToSupabase = async (file: File): Promise<string> => {
  const supabase = await createClient();

  const bucketName = "files"; // Supabase のバケット名を指定
  const filePath = `editor/${Date.now()}-${file.name}`; // ファイル名をユニークにする

  // 画像を Supabase にアップロード
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file);

  if (error) {
    console.error("画像アップロードエラー:", error);
    throw error;
  }

  // アップロード後の公開URLを取得
  const { data: publicURLData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);

  return publicURLData.publicUrl;
};

export const uploadFileToSupabase = async (
  file: File
): Promise<UploadFileResult> => {
  const supabase = await createClient();
  const bucketName = "files";

  // 拡張子を抽出（例: "pdf"）
  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";

  // ランダムなファイル名を生成（例: "editor/1747592049702-a8f3c9e2a7.pdf"）
  const randomStr = randomBytes(8).toString("hex");
  const filePath = `editor/${Date.now()}-${randomStr}.${ext}`;

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file);

  if (error) {
    console.error("ファイルアップロードエラー:", error.message);
    throw error;
  }

  const { data: publicUrlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);

  return {
    url: publicUrlData.publicUrl,
    path: filePath,
    size: file.size,
    type: file.type || ext || "unknown",
  };
};

export async function replaceImageUrlsInHtml(html: string): Promise<string> {
  const $ = cheerio.load(html);
  const imgElements = $("img");

  for (const el of imgElements.toArray()) {
    const src = $(el).attr("src");
    if (!src) continue;

    try {
      const res = await fetch(src);

      if (!res.ok) {
        console.warn(
          `画像取得に失敗（statusエラー）: ${src} - status: ${res.status}`
        );
        continue;
      }

      const blob = await res.blob();

      const originalName = src.split("/").pop() || `image.jpg`;
      const fileExt = originalName.split(".").pop() || "jpg";
      const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
      const file = new File([blob], safeName, { type: blob.type });

      const newUrl = await uploadImageToSupabase(file);
      $(el).attr("src", newUrl);
    } catch (err: any) {
      console.warn(`画像の取得またはアップロードに失敗: ${src}`);
      console.error(err?.message || err);
      continue;
    }
  }

  return $.html();
}
