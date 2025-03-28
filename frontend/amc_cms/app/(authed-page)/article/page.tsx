import PageHeader from "@/components/page-header";
import { selectArticles } from "./actions";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Page() {
  const articles = await selectArticles();
  return (
    <>
      <PageHeader text="投稿" />
      <div className="flex justify-end mb-4 gap-4">
        <Button asChild size="sm" variant="outline">
          <Link href="/article/category">カテゴリー</Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link href="/article/create">新規作成</Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link href="/article/import">インポート</Link>
        </Button>
      </div>
      <div>
        <DataTable columns={columns} data={articles || []} />
      </div>
    </>
  );
}
