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

export default function InputPrice() {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name="price"
      render={({ field }) => (
        <FormItem>
          <FormLabel>料金</FormLabel>
          <FormControl>
            <Input type="number" {...field} placeholder="20000" />
          </FormControl>
          <FormDescription>税抜料金を入力して下さい。</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
