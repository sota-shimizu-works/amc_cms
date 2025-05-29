"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import InputName from "./inputs/input-name";
import InputSlug from "./inputs/input-slug";
import TextareaProvided from "./inputs/textarea-provided";
import InputEditor from "@/components/inputs/InputEditor";

export const formSchema = z.object({
  name: z.string().min(1, "保険診療名は必須です"),
  slug: z.string().min(1, "スラッグは必須です"),
  provided: z.string().min(1, "診療内容は必須です"),
  description: z.string().optional(),
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
      provided: "",
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
        <TextareaProvided />
        <InputEditor
          name="description"
          label="本文"
          description="記事の本文を入力してください。"
          placeholder="ここに本文を入力してください"
        />
        <Button type="submit">{submitLabel}</Button>
      </form>
    </Form>
  );
}
