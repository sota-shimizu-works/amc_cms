import PageHeader from "@/components/page-header";
import { selectCategories } from "./actions";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default async function Page() {
  const categories = await selectCategories();

  return (
    <>
      <PageHeader text="投稿カテゴリ" />
      <div>
        <DataTable columns={columns} data={categories || []} />
      </div>
    </>
  );
}
