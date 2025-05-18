"use client";

import { useState, useEffect } from "react";
import { File } from "@/utils/types";
import { columns } from "./columns";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";
import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { GenericDataTable } from "@/components/GenericDataTable";
import { useRouter } from "next/navigation";

export default function Client() {
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<File[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const res = await fetch("/api/files");
        if (!res.ok) throw new Error("データの取得に失敗しました");
        const data = await res.json();
        setFiles(data);
      } catch (err: any) {
        setError(err.message ?? "不明なエラーが発生しました");
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, []);

  if (loading) return <TableSkeleton rows={5} columns={2} />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <GenericDataTable
      columns={columns}
      data={files || []}
      onRowClick={(row) => router.push(`/file/${row.id}`)}
    />
  );
}
