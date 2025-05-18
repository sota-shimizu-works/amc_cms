"use client";

import { useState } from "react";
import PageForm, { PageFormValues } from "../page-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function PageCreate() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleSubmit = async (values: PageFormValues) => {
    try {
      setPending(true);
      const res = await fetch("/api/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const error = await res.json();
        toast.error("作成失敗", {
          description: error?.error || "メディアの作成に失敗しました。",
        });
        return;
      }

      const data = await res.json();
      toast.success("作成完了", { description: "メディアを作成しました。" });
      router.push(`/file/${data.id}`);
    } catch (e) {
      toast.error("通信エラー", {
        description: "予期せぬエラーが発生しました。",
      });
    } finally {
      setPending(false);
    }
  };

  return <PageForm onSubmit={handleSubmit} submitLabel="作成" />;
}
