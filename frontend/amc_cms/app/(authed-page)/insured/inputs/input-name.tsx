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

export default function InputName() {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>保険診療名</FormLabel>
          <FormControl>
            <Input {...field} placeholder="一般内科" />
          </FormControl>
          <FormDescription>
            ページに表示される保険診療名を入力して下さい。
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
