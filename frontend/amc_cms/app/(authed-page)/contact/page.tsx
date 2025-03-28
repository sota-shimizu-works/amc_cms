import PageHeader from "@/components/page-header";
import { selectContacts } from "./actions";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default async function Page() {
  const contacts = await selectContacts();
  return (
    <>
      <PageHeader text="お問い合わせ" />
      <div>
        <DataTable columns={columns} data={contacts} />
      </div>
    </>
  );
}
