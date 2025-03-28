import PageHeader from "@/components/page-header";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <>
      <div>
        <PageHeader text="インポート" />
        <p className="text-sm text-gray-500 mb-8">
          インポートが正常に完了しました。
        </p>
        <div>
          <Button asChild size="sm" variant="outline">
            <Link href="/article">投稿一覧へ</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
