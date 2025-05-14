"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import InputName from "./inputs/input-name";
import InputSlug from "./inputs/input-slug";
import InputDescription from "./inputs/input-description";

export const formSchema = z.object({
  name: z.string().min(1, "自費診療名は必須です"),
  slug: z.string().min(1, "スラッグは必須です"),
  description: z.string().min(1, "診療内容は必須です"),
});

export type PageFormValues = z.infer<typeof formSchema>;

type PageFormProps = {
  initialValues?: Partial<PageFormValues>;
  onSubmit: (values: PageFormValues) => Promise<void>;
  submitLabel?: string;
};

export default function PageForm({
  initialValues,
  onSubmit,
  submitLabel = "保存",
}: PageFormProps) {
  const form = useForm<PageFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
    },
  });

  // 編集用：初期データが後から来る場合に対応
  useEffect(() => {
    if (initialValues) {
      form.reset({ ...form.getValues(), ...initialValues });
    }
  }, [initialValues]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <InputName />
        <InputSlug />
        <InputDescription
          name="description"
          label="詳細説明"
          description="自費診療の詳細を入力して下さい。"
        />
        <Button type="submit">{submitLabel}</Button>
      </form>
    </Form>
  );
}
