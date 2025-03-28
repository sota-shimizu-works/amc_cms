"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Category } from "@/utils/types";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  name: z.string().nonempty(),
  slug: z.string().nonempty(),
});

export default function ClientForm({ category }: { category: Category }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category.name,
      slug: category.slug,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {}
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-8 md:space-y-0 w-full lg:flex lg:gap-8 items-start">
            <FormField
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>カテゴリ名</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="カテゴリ名を入力してください"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="slug"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>スラッグ名</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="スラッグ名を入力してください"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </>
  );
}
