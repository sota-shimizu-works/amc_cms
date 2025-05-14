import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Client from "./client";

export default function Page() {
  return (
    <>
      <PageHeader text="保険診療" />
      <div className="flex justify-end mb-4 gap-4">
        <Button asChild size="sm" variant="outline">
          <Link href="/insured/create">新規作成</Link>
        </Button>
      </div>
      <div>
        <Client />
      </div>
    </>
  );
}
