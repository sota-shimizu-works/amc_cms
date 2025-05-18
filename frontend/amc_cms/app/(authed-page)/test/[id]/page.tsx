import PageHeader from "@/components/page-header";
import ClientForm from "./clientForm";
import TestReportForm from "./testReportForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Page() {
  return (
    <>
      <div>
        <PageHeader text="検査" />
        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">基本設定</TabsTrigger>
            <TabsTrigger value="test-reports">レポート</TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            <ClientForm />
          </TabsContent>
          <TabsContent value="test-reports">
            <TestReportForm />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
