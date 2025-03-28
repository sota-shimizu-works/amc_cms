"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

export const selectArticles = async (orderByUpdate?: boolean) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("article")
    .select("*, article_category(*, category(*))")
    .order(orderByUpdate ? "updated_at" : "created_at", { ascending: false });

  if (error) {
    console.error("Error getting articles", error);
    return;
  }

  return data;
};

export const selectArticle = async (articleId: number) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("article")
    .select("*, article_category(*, category(*))")
    .eq("id", articleId)
    .single();

  if (error) {
    console.error("Error getting article", error);
    return;
  }

  return data;
};

export const selectCategories = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("category").select("*");

  if (error) {
    console.error("Error getting categories", error);
    return;
  }

  return data;
};

export const updateArticle = async ({
  id,
  title,
  content,
  is_published,
  published_at,
  selected_categories,
}: {
  id: number;
  title: string;
  content: string;
  is_published: boolean;
  published_at: string;
  selected_categories: number[];
}) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("article")
    .update([
      {
        title,
        content,
        is_published,
        published_at,
      },
    ])
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    console.error("Error inserting article", error);
    return false;
  }

  const articleId = data.id;

  await supabase.from("article_category").delete().eq("article_id", articleId);

  const { error: categoryError } = await supabase
    .from("article_category")
    .insert(
      selected_categories.map((category_id) => ({
        article_id: articleId,
        category_id,
      }))
    );

  if (categoryError) {
    console.error("Error inserting article_category", categoryError);
    return false;
  }

  return true;
};

export const insertArticle = async ({
  title,
  content,
  is_published,
  published_at,
  selected_categories,
}: {
  title: string;
  content: string;
  is_published: boolean;
  published_at: string;
  selected_categories: number[];
}) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("article")
    .insert([
      {
        title,
        content,
        is_published,
        published_at,
      },
    ])
    .select("*")
    .single();

  if (error) {
    console.error("Error inserting article", error);
    return false;
  }

  const articleId = data.id;

  if (selected_categories.length !== 0) {
    const { error: categoryError } = await supabase
      .from("article_category")
      .insert(
        selected_categories.map((category_id) => ({
          article_id: articleId,
          category_id,
        }))
      );

    if (categoryError) {
      console.error("Error inserting article_category", categoryError);
      return false;
    }
  }

  return articleId;
};

export async function navigate(id: number) {
  redirect(`/article/${id}`);
}

export const deleteArticle = async (id: number) => {
  const supabase = await createClient();

  const { error: categoryError } = await supabase
    .from("article_category")
    .delete()
    .eq("article_id", id);

  if (categoryError) {
    console.error("Error deleting article_category", categoryError);
    return false;
  }

  const { error } = await supabase.from("article").delete().eq("id", id);

  if (error) {
    console.error("Error deleting article", error);
    return false;
  }

  return redirect("/article");
};
