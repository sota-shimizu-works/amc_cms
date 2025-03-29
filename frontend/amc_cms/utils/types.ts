export type Contact = {
  id: number;
  created_at: string;
  description: string;
  email: string;
  name: string;
  content: string;
  phone: string | null;
  is_read: boolean;
  is_completed: boolean;
  updated_at: string | null;
};

export type Article = {
  id: number;
  created_at: string;
  title: string;
  content: string;
  is_published: boolean;
  published_at: string | null;
  updated_at: string | null;
  article_category?: ArticleCategory[] | null;
  wordpress_post_id: number | null;
};

export type Category = {
  id: number;
  created_at: string;
  name: string;
  slug: string;
  article_category?: ArticleCategory[] | null;
};

export type ArticleCategory = {
  id: number;
  created_at: string;
  article_id: number;
  category_id: number;
  article?: Article | null;
  category?: Category | null;
};

export type WordPressPost = {
  title: string | null;
  link: string | null;
  pubDate: string | null;
  creator: string | null;
  guid: string | null;
  description: string | null;
  encoded: string | null; // content:encoded（HTML本文）
  post_id: string | null;
  post_date: string | null;
  post_date_gmt: string | null;
  post_modified: string | null;
  post_modified_gmt: string | null;
  comment_status: string | null;
  ping_status: string | null;
  post_name: string | null;
  status: string | null;
  post_parent: string | null;
  menu_order: string | null;
  post_type: string | null;
  post_password: string | null;
  is_sticky: string | null;
  category: string[]; // 複数カテゴリに対応
  attachment_url: string | null;
  postmeta: string[]; // 本来はオブジェクト化も可能
};

export type PageBase = {
  id: number;
  created_at: string;
  path: string;
  is_use_layout: boolean;
  content: string | null;
  category_id: number | null;
  meta_title: string | null;
  meta_description: string | null;
};

export type PageCategory = {
  id: number;
  created_at: string;
  name: string;
  page?: Page[] | null;
};

export type Page = PageBase & {
  page_category?: PageCategory | null;
};

export type Location = {
  id: string;
  region: string;
  city: string;
  lat: number | null;
  lng: number | null;
  created_at: string;
};
