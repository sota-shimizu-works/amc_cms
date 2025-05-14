"use client";

import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function InputSlug() {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name="slug"
      render={({ field }) => (
        <FormItem>
          <FormLabel>スラッグ</FormLabel>
          <FormControl>
            <Input {...field} placeholder="nutritional_analysis" />
          </FormControl>
          <FormDescription>
            URLなどに使用するスラッグを入力して下さい。
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
