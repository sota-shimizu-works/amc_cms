import { selectArticle, selectCategories } from "../actions";
import ClientForm from "./clientForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import DeleteButton from "./deleteButton";

export default async function Page({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;
  const article = await selectArticle(id);
  const categories = await selectCategories();

  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-8 gap-4">
          <Button asChild className="mb-4" size="sm" variant="outline">
            <Link href="/article">記事一覧へ戻る</Link>
          </Button>
          <DeleteButton id={id} />
        </div>
        <ClientForm article={article} categories={categories || []} />
      </div>
    </>
  );
}
