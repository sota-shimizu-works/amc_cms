"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Knowledge } from "@/utils/types";
import { columns } from "./columns";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";
import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { GenericDataTable } from "@/components/GenericDataTable";

export default function KnowledgeClient() {
  const [data, setData] = useState<Knowledge[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/knowledge");
        if (!res.ok) throw new Error("データの取得に失敗しました");
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message ?? "不明なエラーが発生しました");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <TableSkeleton rows={5} columns={3} />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <GenericDataTable
      columns={columns}
      data={data || []}
      onRowClick={(row) => router.push(`/knowledge/${row.id}`)}
    />
  );
}
