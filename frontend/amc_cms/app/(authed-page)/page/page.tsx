import PageHeader from "@/components/page-header";
import { selectPages } from "./actions";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Client from "./client";

export default async function Page() {
  const pages = await selectPages();
  return (
    <>
      <PageHeader text="投稿" />
      <div className="flex justify-end mb-4 gap-4">
        <Button asChild size="sm" variant="outline">
          <Link href="/page/category">カテゴリー</Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link href="/page/create">新規作成</Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link href="/page/import">インポート</Link>
        </Button>
      </div>
      <div>
        <Client />
      </div>
    </>
  );
}
