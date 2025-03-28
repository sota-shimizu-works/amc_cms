"use server";

import { WordPressPost } from "@/utils/types";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { replaceImageUrlsInHtml } from "@/utils/uploadImageToSupabase";

export async function checkIsDuplicated(wordpressPosts: WordPressPost[]) {
  const postIds = wordpressPosts.map((post) => post.post_id);
  const uniqueIds = new Set(postIds);

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("article")
    .select("wordpress_post_id")
    .in("wordpress_post_id", Array.from(uniqueIds));

  console.log("data", data);

  if (error) {
    console.error("Error fetching articles", error);
    return [];
  }

  return data;
}

export async function insertWordPressPosts(
  wordpressPosts: WordPressPost[],
  isOverride?: boolean,
  duplicateIds?: string[]
) {
  const supabase = await createClient();
  const now = new Date();

  const convertedPosts = await Promise.all(
    wordpressPosts.map(async (post) => {
      try {
        const newContent = await replaceImageUrlsInHtml(post.encoded || "");
        return { ...post, encoded: newContent };
      } catch (error) {
        console.error(`画像差し替え失敗 (post_id: ${post.post_id})`, error);
        return post; // 元のまま返す
      }
    })
  );

  if (isOverride) {
    await supabase
      .from("article")
      .delete()
      .in("wordpress_post_id", duplicateIds || []);

    // 重複している記事が削除済みのため、convertedPostsのアイテムを全て挿入

    // 挿入データの作成
    const insertData = convertedPosts.map((post) => {
      return {
        title: post.title,
        content: post.encoded,
        wordpress_post_id: post.post_id,
        is_published: post.status === "publish",
        created_at: now,
        published_at: post.post_date,
        updated_at: now,
      };
    });

    // 挿入
    const { error } = await supabase.from("article").insert(insertData);

    if (error) {
      console.error("Error inserting articles", error);
      return false;
    }

    return true;
  } else {
    // 上書き設定がOFFなので、重複している記事以外を挿入
    if (duplicateIds) {
      // 挿入データの作成
      const insertData = convertedPosts
        .filter(
          (post) =>
            post.post_id !== null &&
            !duplicateIds.includes(String(post.post_id))
        )
        .map((post) => {
          return {
            title: post.title,
            content: post.encoded,
            wordpress_post_id: post.post_id,
            is_published: post.status === "publish",
            created_at: now,
            published_at: post.post_date,
            updated_at: now,
          };
        });

      // 挿入
      const { error } = await supabase.from("article").insert(insertData);

      if (error) {
        console.error("Error inserting articles", error);
        return false;
      }

      return true;
    } else {
      // 重複がないので、全ての記事を挿入

      // 挿入データの作成
      const insertData = convertedPosts.map((post) => {
        return {
          title: post.title,
          content: post.encoded,
          wordpress_post_id: post.post_id,
          is_published: post.status === "publish",
          created_at: now,
          published_at: post.post_date,
          updated_at: now,
        };
      });

      // 挿入
      const { error } = await supabase.from("article").insert(insertData);

      if (error) {
        console.error("Error inserting articles", error);
        return false;
      }

      return true;
    }
  }
}

export async function redirectSuccess() {
  redirect("/article/import/success");
}
