"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Knowledge } from "@/utils/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useParams } from "next/navigation";

export default function KnowledgeDetailPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };

  const [data, setData] = useState<Knowledge | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isEmbedding, setIsEmbedding] = useState(false);
  const [error, setError] = useState("");

  // データ取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/knowledge/${id}`);
        if (!res.ok) throw new Error("ナレッジの取得に失敗しました");
        const json = await res.json();
        setData(json);
        setTitle(json.title);
        setCategory(json.category);
        setContent(json.content);
      } catch (err: any) {
        setError(err.message ?? "不明なエラーが発生しました");
      }
    };
    fetchData();
  }, [id]);

  // 更新
  const handleUpdate = async () => {
    setError("");
    setIsSaving(true);

    // ナレッジの更新
    const res = await fetch(`/api/knowledge/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, category, content }),
    });

    if (!res.ok) {
      setIsSaving(false);
      setError("更新に失敗しました");
      return;
    }

    // embeddingの再生成
    const embeddingRes = await fetch("/api/embedding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, content }),
    });

    if (!embeddingRes.ok) {
      setError("保存は成功しましたが、embedding生成に失敗しました");
    } else {
      alert("✅ 保存＆embedding生成が完了しました");
    }

    setIsSaving(false);
    router.refresh();
  };

  const handleDelete = async () => {
    const ok = confirm("本当に削除しますか？この操作は取り消せません。");
    if (!ok) return;

    setIsSaving(true);
    const res = await fetch(`/api/knowledge/${id}`, {
      method: "DELETE",
    });

    setIsSaving(false);

    if (!res.ok) {
      setError("削除に失敗しました");
    } else {
      alert("削除が完了しました");
      router.push("/knowledge"); // 一覧ページなどに戻す
    }
  };

  if (error) {
    return (
      <div className="max-w-xl mx-auto p-4 text-red-600 font-bold">{error}</div>
    );
  }

  if (!data) {
    return <div className="max-w-xl mx-auto p-4">読み込み中...</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6">
      <h1 className="text-xl font-bold">ナレッジ編集</h1>

      <div className="space-y-2">
        <Label htmlFor="title">タイトル</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">カテゴリ</Label>
        <Input
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">本文</Label>
        <Textarea
          id="content"
          value={content}
          rows={8}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <div className="flex gap-4">
        <Button onClick={handleUpdate} disabled={isSaving}>
          {isSaving ? "保存中..." : "保存する"}
        </Button>
        <Button
          onClick={handleDelete}
          variant="destructive"
          disabled={isSaving}
        >
          削除する
        </Button>
      </div>

      {data.embedding && (
        <p className="text-sm text-gray-500">
          現在のベクトルは保存済みです（{data.embedding.length}次元）
        </p>
      )}
    </div>
  );
}
