"use client";

import { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Contact } from "@/utils/types";
import dayjs from "dayjs";
import ja from "dayjs/locale/ja";
dayjs.locale(ja);
import ReadBadge from "@/components/read-badge";
import { Check } from "lucide-react";

export const columns: ColumnDef<Contact>[] = [
  {
    accessorKey: "is_read",
    header: "開封状態",
    cell: ({ row }) => {
      return <ReadBadge isRead={row.original.is_read} />;
    },
  },
  {
    accessorKey: "created_at",
    header: "お問い合わせ日時",
    cell: ({ row }) => {
      const [formattedDate, setFormattedDate] = useState("");

      useEffect(() => {
        const date = new Date(row.original.created_at);
        const created_at = dayjs(date).format("YYYY年MM月DD日 HH:mm");
        setFormattedDate(created_at);
      }, [row.original.created_at]);

      return formattedDate;
    },
  },
  {
    accessorKey: "description",
    header: "件名",
  },
  {
    accessorKey: "name",
    header: "名前",
  },
  {
    accessorKey: "is_completed",
    header: "対応状況",
    cell: ({ row }) => {
      return row.original.is_completed ? (
        <div className="text-center">
          <Check className="text-green-500" />
        </div>
      ) : null;
    },
  },
];
