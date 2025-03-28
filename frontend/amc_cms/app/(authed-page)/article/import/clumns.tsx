"use client";

import { ColumnDef } from "@tanstack/react-table";
import { WordPressPost } from "@/utils/types";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<WordPressPost>[] = [
  {
    accessorKey: "post_id",
    header: "ID",
  },
  {
    accessorKey: "title",
    header: "タイトル",
  },
  {
    accessorKey: "link",
    header: "元リンク",
  },
  {
    accessorKey: "status",
    header: "ステータス",
    cell: ({ row }) => {
      if (row.original.status === "publish") {
        return <Badge className="bg-green-400">公開</Badge>;
      } else {
        return <Badge className="bg-gray-600">非公開</Badge>;
      }
    },
  },
];
