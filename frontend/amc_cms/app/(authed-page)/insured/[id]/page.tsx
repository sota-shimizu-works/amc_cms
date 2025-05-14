import PageHeader from "@/components/page-header";
import ClientForm from "./clientForm";
import PatientForm from "./patientForm";
import InsuredTestForm from "./insuredTestForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Page() {
  return (
    <>
      <div>
        <PageHeader text="保険診療" />
        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">基本設定</TabsTrigger>
            <TabsTrigger value="insured-patients">対象</TabsTrigger>
            <TabsTrigger value="insured-tests">関連検査</TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            <ClientForm />
          </TabsContent>
          <TabsContent value="insured-patients">
            <PatientForm />
          </TabsContent>
          <TabsContent value="insured-tests">
            <InsuredTestForm />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
