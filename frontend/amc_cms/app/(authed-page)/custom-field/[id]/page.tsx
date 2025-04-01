import PageHeader from "@/components/page-header";
import ClientForm from "./clientForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <div>
        <div>
          <Button asChild size="sm">
            <Link href="/custom-field">戻る</Link>
          </Button>
        </div>
        <PageHeader text="カスタムフィールド設定" />
        <ClientForm />
      </div>
    </>
  );
}
