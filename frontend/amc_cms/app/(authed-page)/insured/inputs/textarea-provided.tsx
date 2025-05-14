"use client";

import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

export default function TextareaProvided() {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name="provided"
      render={({ field }) => (
        <FormItem>
          <FormLabel>診療内容</FormLabel>
          <FormControl>
            <Textarea
              {...field}
              placeholder="保険資料ページ冒頭の説明文です。"
              rows={4}
              className="resize-y"
            />
          </FormControl>
          <FormDescription>保険資料ページ冒頭の説明文です。</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
