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
          <FormLabel>メディア名</FormLabel>
          <FormControl>
            <Input {...field} placeholder="インフルエンザ問診票" />
          </FormControl>
          <FormDescription>
            識別できるメディア名を入力してください。
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
