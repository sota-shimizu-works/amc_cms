// @/app/(authed-page)/chat/columns.ts
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ChatLog } from "@/utils/types";

export const columns: ColumnDef<ChatLog>[] = [
  {
    accessorKey: "conversation_id",
    header: "会話ID",
    cell: ({ row }) => (
      <div className="truncate max-w-[180px] text-sm text-gray-700">
        {row.getValue("conversation_id")}
      </div>
    ),
  },
  {
    accessorKey: "is_admin",
    header: "種別",
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.is_admin ? "管理者" : "匿名ユーザー"}
      </span>
    ),
  },
  {
    accessorKey: "query",
    header: "質問",
    cell: ({ row }) => (
      <div className="line-clamp-2 text-sm text-gray-600">
        {row.original.query}
      </div>
    ),
  },
  {
    accessorKey: "answer",
    header: "回答",
    cell: ({ row }) => (
      <div className="line-clamp-2 text-sm text-gray-600">
        {row.original.answer}
      </div>
    ),
  },
  {
    accessorKey: "created_at",
    header: "日時",
    cell: ({ row }) => {
      const date = new Date(row.original.created_at);
      return (
        <div className="text-sm text-muted-foreground">
          {date.toLocaleString("ja-JP")}
        </div>
      );
    },
  },
];
