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
  custom_fields?: PageCustomFieldValue[];
};

export type Location = {
  id: string;
  region: string;
  city: string;
  lat: number | null;
  lng: number | null;
  created_at: string;
};

export type ChatLog = {
  id: string; // UUID
  user_id: string | null; // Supabase認証ユーザーのID（CMS用）
  session_id: string | null; // 匿名ユーザーの識別子（WEB用）
  is_admin: boolean; // 管理者フラグ
  conversation_id: string; // Difyの会話ID
  query: string; // ユーザーの質問
  answer: string; // Botの回答
  created_at: string; // ISO形式の日付文字列（timestamp with time zone）
};

export type Knowledge = {
  id: string; // uuid
  title: string;
  content: string;
  category: string;
  metadata: Record<string, any> | null; // JSONB
  embedding: number[] | null; // pgvector (nullableで定義)
  created_at: string; // ISO timestamp
};

export type CustomFieldDefinition = {
  id: number;
  key: string;
  label: string;
  type:
    | "text"
    | "textarea"
    | "select"
    | "checkbox"
    | "radio"
    | "date"
    | "group";
  options: string[] | null; // JSONBに保存される選択肢
  is_repeatable: boolean;
  page_category_id: number | null;
  created_at: string;
  page_category?: PageCategory | null;
};

export type PageCustomFieldValue = {
  id: number;
  page_id: number;
  field_key: string;
  value: any; // JSONBなので型は柔軟に対応、必要なら union 型なども定義可能
  sort_order: number;
  created_at: string;
};

export type Test = {
  id: number;
  created_at: string;
  name: string;
  slug: string;
  price: number;
  about: string;
  description: string;
  test_report?: TestReport[] | null;
};

export type Insured = {
  id: number;
  created_at: string;
  name: string;
  slug: string;
  provided: string;
  description: string | null;
  insured_patient?: InsuredPatient[] | null;
};

export type InsuredPatient = {
  id: number;
  created_at: string;
  name: string;
  slug: string;
  description: string;
  insured_id: number;
};

export type InsuredTest = {
  id: number;
  created_at: string;
  test_id: number;
  insured_id: number;
  test?: Test | null;
  insured?: Insured | null;
};

export type NonInsured = {
  id: number;
  created_at: string;
  name: string;
  slug: string;
  description: string;
  non_insured_information?: NonInsuredInformation[] | null;
};

export type NonInsuredTest = {
  id: number;
  created_at: string;
  test_id: number;
  non_insured_id: number;
  test?: Test | null;
  non_insured?: NonInsured | null;
};

export type File = {
  id: number;
  created_at: string;
  name: string;
  path: string;
  url: string;
  type: string;
  size: number;
};

export type TestReport = {
  id: number;
  created_at: string;
  title: string;
  test_id: number;
  test?: Test | null;
  file_id: number;
  file?: File | null;
};

export type InsuredInformation = {
  id: number;
  created_at: string;
  title: string;
  content: string;
  url: string;
  insured_id: number;
  insured?: Insured | null;
};

export type NonInsuredInformation = {
  id: number;
  created_at: string;
  title: string;
  content: string;
  url: string;
  non_insured_id: number;
  non_insured?: NonInsured | null;
};
