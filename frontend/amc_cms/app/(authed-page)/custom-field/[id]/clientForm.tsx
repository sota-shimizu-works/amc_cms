"use client";

import { useEffect, useState } from "react";
import PageForm, { PageFormValues } from "../page-form";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import FormSkeleton from "@/components/skeletons/FormSkeleton";
import { Button } from "@/components/ui/button";
import DeleteConfirmButton from "@/components/shared/DeleteConfirmButton";

export default function PageEdit() {
  const { id } = useParams();
  const router = useRouter();

  const [initialValues, setInitialValues] =
    useState<Partial<PageFormValues> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/custom-field/${id}`);
      if (!res.ok) throw new Error("カスタムフィールドの取得に失敗しました");
      const data = await res.json();
      setInitialValues(data);
    } catch (e) {
      console.error(e);
      setError(
        "カスタムフィールドの取得に失敗しました。ネットワーク接続や権限をご確認ください。"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleSubmit = async (values: PageFormValues) => {
    try {
      const res = await fetch(`/api/custom-field/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const error = await res.json();
        toast.error("更新失敗", {
          description: error?.error || "更新に失敗しました。",
        });
        return;
      }

      toast.success("更新完了", {
        description: "カスタムフィールドを更新しました。",
      });
      router.push(`/custom-field/${id}`);
    } catch (e) {
      toast.error("通信エラー", {
        description: "予期せぬエラーが発生しました。",
      });
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/custom-field/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const error = await res.json();
        toast.error("削除失敗", {
          description: error?.error || "削除に失敗しました。",
        });
        return;
      }
      toast.success("削除完了", {
        description: "カスタムフィールドを削除しました。",
      });
      router.push("/custom-field");
    } catch {
      toast.error("通信エラー", { description: "削除処理に失敗しました。" });
    }
  };

  // ローディング中
  if (loading) return <FormSkeleton />;

  // エラー表示
  if (error) {
    return (
      <div className="space-y-4">
        <ErrorAlert message={error} />
        <Button onClick={fetchData}>再試行</Button>
      </div>
    );
  }

  // フォーム表示
  return (
    <>
      <div className="mb-4 flex justify-end">
        <DeleteConfirmButton
          onDelete={handleDelete}
          title="削除"
          description="このページを本当に削除しますか？この操作は取り消せません。"
          triggerLabel="カスタムフィールドを削除"
          confirmLabel="はい、削除します"
        />
      </div>
      <PageForm
        initialValues={initialValues || {}}
        onSubmit={handleSubmit}
        submitLabel="更新"
      />
    </>
  );
}
