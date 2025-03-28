# Aqua CMS

Aqua Medical Clinic 向けに構築された、**Next.js + Supabase + Vercel** ベースのオリジナルCMSです。  
既存の WordPress サイトからの移行を目的としており、より高速かつ柔軟なコンテンツ管理体験を提供します。

---

## 🚀 技術スタック

- **Next.js (App Router, TypeScript)**
- **Supabase**（認証、データベース、ストレージ）
- **Vercel**（デプロイ＆ホスティング）
- **shadcn/ui**（UI コンポーネント）
- **Zod + React Hook Form**（フォームバリデーション）
- **@tanstack/react-table**（データテーブル）
- **Sonner**（通知トースト）
- その他、多数のヘッドレスUIやエディタライブラリを採用

---

## 🛠️ セットアップ手順（frontend）

このプロジェクトは Docker 環境で構築されています。  
ここでは `amc_cms`（Next.js）をローカルで起動するまでの手順を記載します。

```bash
# 1. amc_cms ディレクトリに移動
cd amc_cms

# 2. 依存関係のインストール
npm install

# 3. 環境変数ファイルの作成
cp .env.example .env

# 4. 環境変数に Supabase の設定を入力
# （SUPABASE_URL、SUPABASE_ANON_KEY など）

# 5. 開発サーバーの起動
npm run dev
```
