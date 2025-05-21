"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import DeleteConfirmButton from "@/components/shared/DeleteConfirmButton";

export default function InformationForm() {
  const { id } = useParams(); // non_insured_id
  const [informations, setInformations] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");

  async function fetchInformations() {
    const res = await fetch(
      `/api/non-insured-informations?non_insured_id=${id}`
    );
    if (res.ok) {
      const data = await res.json();
      setInformations(data);
    }
  }

  useEffect(() => {
    fetchInformations();
  }, [id]);

  async function handleAddInformation() {
    if (!title || !content) {
      toast.error("タイトルと内容は必須です");
      return;
    }

    const res = await fetch("/api/non-insured-informations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        non_insured_id: Number(id),
        title,
        content,
        url,
      }),
    });

    if (res.ok) {
      toast.success("告知を追加しました");
      setDialogOpen(false);
      setTitle("");
      setContent("");
      setUrl("");
      fetchInformations();
    } else {
      toast.error("追加に失敗しました");
    }
  }

  async function handleDelete(informationId: number) {
    const res = await fetch(`/api/non-insured-informations/${informationId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      toast.success("削除しました");
      fetchInformations();
    } else {
      toast.error("削除に失敗しました");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>告知を追加</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>告知を追加</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="タイトル"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Textarea
                placeholder="内容"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <Input
                placeholder="リンクURL（任意）"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    キャンセル
                  </Button>
                </DialogClose>
                <Button onClick={handleAddInformation}>追加</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {informations.map((item) => (
          <div
            key={item.id}
            className="border p-4 rounded-md flex justify-between items-start"
          >
            <div className="space-y-1">
              <div className="font-bold">{item.title}</div>
              <div className="text-sm whitespace-pre-wrap">{item.content}</div>
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 underline"
                >
                  {item.url}
                </a>
              )}
            </div>
            <DeleteConfirmButton
              onDelete={() => handleDelete(item.id)}
              title="削除"
              description="この告知を削除してもよろしいですか？"
              triggerLabel="削除"
              confirmLabel="はい、削除する"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
