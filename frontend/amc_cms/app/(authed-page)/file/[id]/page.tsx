import PageHeader from "@/components/page-header";
import ClientForm from "./clientForm";

export default function Page() {
  return (
    <>
      <div>
        <PageHeader text="メディア" />
        <ClientForm />
      </div>
    </>
  );
}
