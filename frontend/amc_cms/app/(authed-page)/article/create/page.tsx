import { selectCategories } from "../actions";
import ClientForm from "./clientForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Page() {
  const categories = await selectCategories();

  return (
    <>
      <div>
        <Button asChild className="mb-4" size="sm" variant="outline">
          <Link href="/article">記事一覧へ戻る</Link>
        </Button>
        <ClientForm categories={categories || []} />
      </div>
    </>
  );
}
