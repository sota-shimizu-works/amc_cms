import PageHeader from "@/components/page-header";
import ClientForm from "./clientForm";

export default async function Page() {
  return (
    <>
      <div>
        <PageHeader text="ページ設定追加" />
        <div>
          <ClientForm />
        </div>
      </div>
    </>
  );
}
