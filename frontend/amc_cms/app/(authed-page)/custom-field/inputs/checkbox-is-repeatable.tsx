"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";

export default function CheckboxIsRepeatable() {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name="is_use_layout"
      render={({ field }) => (
        <FormItem className="flex items-center gap-2 space-y-0">
          <FormControl>
            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
          <div className="grid gap-0.5 leading-none">
            <FormLabel>繰り返しフィールドを適用する</FormLabel>
            <FormDescription>
              このフィールドを複数回入力できるようにします
            </FormDescription>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}
