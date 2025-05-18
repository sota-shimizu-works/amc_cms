"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import InputName from "./inputs/input-name";
import InputFile from "./inputs/input-file";

export const formSchema = z.object({
  name: z.string().min(1, "メディア名は必須です"),
  path: z.string().min(1, "パスは必須です"),
  url: z.string().min(1, "URLは必須です"),
  size: z.preprocess(
    (val) => (typeof val === "string" ? Number(val) : val),
    z.number().min(1, "サイズは必須です")
  ),
  type: z.string().min(1, "タイプは必須です"),
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
      path: "",
      url: "",
      size: 0,
      type: "",
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
        <InputFile />
        <Button type="submit">{submitLabel}</Button>
      </form>
    </Form>
  );
}
