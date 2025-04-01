"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react"; // アイコン（任意）

export default function InputOptionsArray() {
  const { control, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  const type = watch("type");

  if (!["select", "checkbox", "radio"].includes(type)) {
    return null; // 対象タイプ以外では表示しない
  }

  return (
    <FormField
      control={control}
      name="options"
      render={() => (
        <FormItem>
          <FormLabel>選択肢（複数可）</FormLabel>
          <div className="space-y-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-center">
                <FormControl>
                  <Input
                    {...control.register(`options.${index}` as const)}
                    placeholder={`選択肢 ${index + 1}`}
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => remove(index)}
                  size="icon"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => append("")}
              size="sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              追加
            </Button>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
