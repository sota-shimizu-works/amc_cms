"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Knowledge } from "@/utils/types";
import dayjs from "dayjs";

export const columns: ColumnDef<Knowledge>[] = [
  {
    accessorKey: "title",
    header: "タイトル",
    cell: ({ row }) => (
      <div className="font-medium text-blue-600">{row.original.title}</div>
    ),
  },
  {
    accessorKey: "category",
    header: "カテゴリ",
    cell: ({ row }) => (
      <span className="text-gray-700">{row.original.category}</span>
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
