import PageHeader from "@/components/page-header";
import ClientForm from "./clientForm";
import PageCustomFieldForm from "./customFieldForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Page() {
  return (
    <>
      <div>
        <PageHeader text="ページ設定" />
        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">基本設定</TabsTrigger>
            <TabsTrigger value="custom-field">カスタムフィールド</TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            <ClientForm />
          </TabsContent>
          <TabsContent value="custom-field">
            <PageCustomFieldForm />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
