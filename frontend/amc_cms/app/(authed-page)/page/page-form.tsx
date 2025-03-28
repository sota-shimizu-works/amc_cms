"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import InputPath from "./inputs/input-path";
import SelectCategory from "./inputs/select-category";
import CheckboxIsUseLayout from "./inputs/checkbox-is-use-layout";
import InputMetaTitle from "./inputs/input-meta-title";
import TextareaMetaDescription from "./inputs/textarea-meta-description";

export const formSchema = z.object({
  path: z
    .string()
    .min(1, "PATHは必須です")
    .refine((val) => val.startsWith("/"), {
      message: "PATHは / から始めてください",
    })
    .refine((val) => val.length === 1 || !val.endsWith("/"), {
      message: "末尾の / は不要です",
    })
    .refine(
      (val) =>
        /^\/[a-zA-Z0-9\u3040-\u30FF\u4E00-\u9FAF_\-/]*(\?[a-zA-Z0-9_\-&=％ぁ-んァ-ヶー一-龠]*)?$/.test(
          val
        ),
      {
        message:
          "PATHには英数字・日本語・スラッシュ・ハイフン・アンダースコア・GETパラメータのみ使用できます",
      }
    ),
  is_use_layout: z.boolean(),
  content: z.string().nullable().optional(),
  category_id: z.number().nullable().optional(),
  meta_title: z.string().nullable().optional(),
  meta_description: z.string().nullable().optional(),
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
      path: "/",
      is_use_layout: true,
      content: "",
      category_id: null,
      meta_title: "",
      meta_description: "",
      ...initialValues, // 編集時用
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
        <CheckboxIsUseLayout />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <InputPath />
          <SelectCategory />
        </div>
        <hr />
        <InputMetaTitle />
        <TextareaMetaDescription />
        <Button type="submit">{submitLabel}</Button>
      </form>
    </Form>
  );
}
