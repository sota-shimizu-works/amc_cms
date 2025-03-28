"use client";

import { Button } from "@/components/ui/button";
import { deleteArticle } from "../actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

export default function DeleteButton({ id }: { id: number }) {
  const handleDelete = async () => {
    await deleteArticle(id);
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" variant="destructive">
            削除
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>本当に削除してよろしいですか？</DialogTitle>
            <DialogDescription>
              削除した記事は元に戻すことができません。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="destructive" onClick={() => handleDelete()}>
              削除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
