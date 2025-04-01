"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CustomFieldDefinition } from "@/utils/types";
import dayjs from "dayjs";

export const columns: ColumnDef<CustomFieldDefinition>[] = [
  {
    accessorKey: "key",
    header: "フィールドキー",
    cell: ({ row }) => (
      <div className="font-medium text-blue-600">{row.original.key}</div>
    ),
  },
  {
    accessorKey: "label",
    header: "フィールド名",
    cell: ({ row }) => (
      <div className="text-gray-700">{row.original.label}</div>
    ),
  },
  {
    accessorKey: "type",
    header: "タイプ",
    cell: ({ row }) => (
      <span className="text-gray-700">{row.original.type}</span>
    ),
  },
  {
    accessorKey: "page_category_id",
    header: "ページカテゴリ",
    cell: ({ row }) => (
      <span className="text-gray-700">
        {(row.original.page_category && row.original.page_category.name) ||
          "未設定"}
      </span>
    ),
  },
  {
    accessorKey: "created_at",
    header: "作成日",
    cell: ({ row }) => {
      const date = dayjs(row.original.created_at).format("YYYY/MM/DD HH:mm");
      return <span className="text-gray-500 text-sm">{date}</span>;
    },
  },
];
