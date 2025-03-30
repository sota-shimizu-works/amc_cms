import PageHeader from "@/components/page-header";
import Client from "./client";
import { BotMessageSquare } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <>
      <div>
        <PageHeader text="AIエージェント" />

        <div className="flex justify-end items-center gap-3 mb-4">
          <Button variant="outline" asChild>
            <Link href="knowledge">ナレッジ管理</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/chat/test" className="flex items-center gap-1">
              <BotMessageSquare size={12} />
              <span>チャットテスト</span>
            </Link>
          </Button>
        </div>

        <Client />
      </div>
    </>
  );
}
