import PageHeader from "@/components/page-header";
import Client from "./client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <div>
        <PageHeader text="ナレッジ管理" />

        <div className="flex justify-end items-center mb-4">
          <Button asChild variant="outline">
            <Link href="/knowledge/create">新規ナレッジ追加</Link>
          </Button>
        </div>
        <Client />
      </div>
    </>
  );
}
