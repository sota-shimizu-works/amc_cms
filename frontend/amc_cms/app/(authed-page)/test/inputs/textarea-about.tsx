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

export default function TextareaAbout() {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name="about"
      render={({ field }) => (
        <FormItem>
          <FormLabel>概要</FormLabel>
          <FormControl>
            <Textarea
              {...field}
              placeholder="検査ページ冒頭の説明文です。270文字程度で簡単に説明して下さい。"
              rows={4}
              className="resize-y"
            />
          </FormControl>
          <FormDescription>
            検査ページ冒頭の説明文です。270文字程度で簡単に説明して下さい。
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
