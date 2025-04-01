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
import { PageCategory } from "@/utils/types";

export default function SelectPageCategory() {
  const { control } = useFormContext();
  const [categories, setCategories] = useState<PageCategory[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch("/api/page-categories");
      const data = await res.json();
      setCategories(data);
    };

    fetchCategories();
  }, []);

  return (
    <Controller
      name="page_category_id"
      control={control}
      render={({ field }) => (
        <div className="space-y-1">
          <Label>カテゴリ</Label>
          <Select
            onValueChange={(value) => field.onChange(Number(value))}
            value={field.value ? String(field.value) : ""}
          >
            <SelectTrigger>
              <SelectValue placeholder="カテゴリを選択" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={String(cat.id)}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-[0.8rem] text-muted-foreground pt-1">
            カテゴリに属するページ全てに適用させる場合に選択してください
          </p>
        </div>
      )}
    />
  );
}
