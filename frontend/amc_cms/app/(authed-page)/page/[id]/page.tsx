import PageHeader from "@/components/page-header";
import ClientForm from "./clientForm";

export default function Page() {
  return (
    <>
      <div>
        <PageHeader text="ページ設定" />
        <ClientForm />
      </div>
    </>
  );
}
