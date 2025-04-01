"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CustomFieldDefinition, PageCategory } from "@/utils/types";
import { columns } from "./columns";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";
import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { DataTable } from "./data-table";

export default function CustomFieldClient() {
  const [data, setData] = useState<
    (CustomFieldDefinition & { page_category: PageCategory | null })[] | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/custom-field");
        if (!response.ok) {
          throw new Error("データの取得に失敗しました");
        }
        const customFields = await response.json();
        setData(customFields);
      } catch (err: any) {
        setError(err.message ?? "データの取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <TableSkeleton rows={5} columns={4} />;
  if (error) return <ErrorAlert message={error} />;

  return <DataTable columns={columns} data={data || []} />;
}
