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
import { Input } from "@/components/ui/input";

export default function InputMetaTitle() {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name="meta_title"
      render={({ field }) => (
        <FormItem>
          <FormLabel>メタタイトル</FormLabel>
          <FormControl>
            <Input
              {...field}
              placeholder="例: サービス紹介 | MySite"
              autoComplete="off"
            />
          </FormControl>
          <FormDescription>
            ページのタイトルに使用されます（SEOやブラウザタブに表示される内容）。
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
