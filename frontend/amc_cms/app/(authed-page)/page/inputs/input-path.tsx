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

export default function InputPath() {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name="path"
      render={({ field }) => (
        <FormItem>
          <FormLabel>PATH</FormLabel>
          <FormControl>
            <Input {...field} placeholder="/path/to/page" />
          </FormControl>
          <FormDescription>
            "/"から始まるパスを指定してください。
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
