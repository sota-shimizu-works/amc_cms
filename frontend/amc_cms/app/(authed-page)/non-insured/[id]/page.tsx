import PageHeader from "@/components/page-header";
import ClientForm from "./clientForm";
import NonInsuredTestForm from "./nonInsuredTestForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Page() {
  return (
    <>
      <div>
        <PageHeader text="保険診療" />
        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">基本設定</TabsTrigger>
            <TabsTrigger value="non-insured-tests">関連検査</TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            <ClientForm />
          </TabsContent>
          <TabsContent value="non-insured-tests">
            <NonInsuredTestForm />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
