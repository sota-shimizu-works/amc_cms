import PageHeader from "@/components/page-header";
import CustomFieldForm from "./clientForm";

export default function CreateCustomFieldPage() {
  return (
    <>
      <PageHeader text="カスタムフィールド作成" />
      <CustomFieldForm />
    </>
  );
}
