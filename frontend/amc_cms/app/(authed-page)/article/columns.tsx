"use client";

import { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Article } from "@/utils/types";
import dayjs from "dayjs";
import ja from "dayjs/locale/ja";
dayjs.locale(ja);
import { Eye, EyeClosed } from "lucide-react";

export const columns: ColumnDef<Article>[] = [
  {
    accessorKey: "title",
    header: "タイトル",
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
  {
    accessorKey: "published_at",
    header: "公開日時",
    cell: ({ row }) => {
      const [formattedDate, setFormattedDate] = useState("");

      useEffect(() => {
        if (row.original.published_at) {
          const date = new Date(row.original.published_at);
          const published_at = dayjs(date).format("YYYY年MM月DD日 HH:mm");
          setFormattedDate(published_at);
        }
      }, [row.original.published_at]);

      return formattedDate;
    },
  },
  {
    accessorKey: "is_published",
    header: "公開状況",
    cell: ({ row }) => {
      return row.original.is_published ? (
        <div className="text-center">
          <Eye className="text-green-500" size={17} />
        </div>
      ) : (
        <div className="text-center">
          <EyeClosed className="text-gray-500" size={17} />
        </div>
      );
    },
  },
];
