"use client";

import { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { NonInsured } from "@/utils/types";
import dayjs from "dayjs";
import ja from "dayjs/locale/ja";
dayjs.locale(ja);

export const columns: ColumnDef<NonInsured>[] = [
  {
    accessorKey: "name",
    header: "名前",
  },
  {
    accessorKey: "slug",
    header: "スラッグ",
  },
  {
    accessorKey: "created_at",
    header: "作成日時",
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
];
