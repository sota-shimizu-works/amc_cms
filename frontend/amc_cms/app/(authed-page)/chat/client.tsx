"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChatLog } from "@/utils/types";
import { columns } from "./columns";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";
import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { GenericDataTable } from "@/components/GenericDataTable";

export default function Client() {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<ChatLog[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch("/api/chat");
        if (!res.ok) throw new Error("チャットログの取得に失敗しました");
        const { data } = await res.json();
        setLogs(data);
      } catch (err: any) {
        setError(err.message ?? "不明なエラーが発生しました");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (loading) return <TableSkeleton rows={5} columns={4} />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <GenericDataTable
      columns={columns}
      data={logs || []}
      onRowClick={(row) => router.push(`/chat/${row.conversation_id}`)}
    />
  );
}
