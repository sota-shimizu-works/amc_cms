"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";

export default function InputLabel() {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name="label"
      render={({ field }) => (
        <FormItem>
          <FormLabel>ラベル</FormLabel>
          <FormControl>
            <Input placeholder="ラベル" {...field} />
          </FormControl>
          <FormDescription>フォームに表示されるラベルです</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
