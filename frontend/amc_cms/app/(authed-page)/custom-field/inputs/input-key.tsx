"use client";

import { useFormContext, Controller } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function InputKey() {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name="key"
      render={({ field }) => (
        <FormItem>
          <FormLabel>キー</FormLabel>
          <FormControl>
            <Input placeholder="tel,email...etc" {...field} />
          </FormControl>
          <FormDescription>
            カスタムフィールドを識別するための一意のキーです
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
