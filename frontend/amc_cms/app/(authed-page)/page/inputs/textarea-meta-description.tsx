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

export default function TextareaMetaDescription() {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name="meta_description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>メタディスクリプション</FormLabel>
          <FormControl>
            <Textarea
              {...field}
              placeholder="このページの簡単な説明を記載（SEOに使用されます）"
              rows={4}
              className="resize-y"
            />
          </FormControl>
          <FormDescription>
            SEO 対策や SNS
            シェア時の説明文として使用されます。120〜160文字程度が推奨されます。
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
