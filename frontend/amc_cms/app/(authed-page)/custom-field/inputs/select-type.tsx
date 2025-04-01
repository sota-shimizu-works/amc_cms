"use client";

import { useEffect, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const typeChoices = [
  {
    value: "text",
    label: "テキスト",
  },
  {
    value: "textarea",
    label: "テキストエリア",
  },
  {
    value: "select",
    label: "セレクト",
  },
  {
    value: "checkbox",
    label: "チェックボックス",
  },
  {
    value: "radio",
    label: "ラジオボタン",
  },
  {
    value: "date",
    label: "日付",
  },
  {
    value: "group",
    label: "グループ",
  },
];

export default function SelectType() {
  const { control } = useFormContext();

  return (
    <Controller
      name="type"
      control={control}
      render={({ field }) => (
        <div className="space-y-1">
          <Label>タイプ</Label>
          <Select
            onValueChange={(value) => field.onChange(value)}
            value={field.value ? field.value : ""}
          >
            <SelectTrigger>
              <SelectValue placeholder="タイプを選択" />
            </SelectTrigger>
            <SelectContent>
              {typeChoices.map((choice) => (
                <SelectItem key={choice.value} value={choice.value}>
                  {choice.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    />
  );
}
