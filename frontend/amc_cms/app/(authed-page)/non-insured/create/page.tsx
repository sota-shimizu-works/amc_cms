import PageHeader from "@/components/page-header";
import ClientForm from "./clientForm";

export default async function Page() {
  return (
    <>
      <div>
        <PageHeader text="自費診療追加" />
        <div>
          <ClientForm />
        </div>
      </div>
    </>
  );
}
