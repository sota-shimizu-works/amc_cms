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
      const res = await fetch("/api/custom-field", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const error = await res.json();
        toast.error("作成失敗", {
          description: error?.error || "ページの作成に失敗しました。",
        });
        return;
      }

      const data = await res.json();
      toast.success("作成完了", { description: "ページを作成しました。" });
      router.push(`/custom-field/${data.id}`);
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
