"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import InputKey from "./inputs/input-key";
import InputLabel from "./inputs/input-label";
import CheckboxIsRepeatable from "./inputs/checkbox-is-repeatable";
import SelectType from "./inputs/select-type";
import SelectPageCategory from "./inputs/select-page-category";
import InputOptionsArray from "./inputs/inputOptionsArray";

export const formSchema = z
  .object({
    key: z
      .string()
      .min(1, "キーは必須です")
      .regex(/^[a-zA-Z0-9_-]+$/, {
        message: "キーには英数字、ハイフン、アンダースコアのみ使用できます",
      }),
    label: z.string().min(1, "ラベルは必須です"),
    type: z.enum(
      ["text", "textarea", "select", "checkbox", "radio", "date", "group"],
      {
        errorMap: () => ({ message: "フィールドタイプを選択してください" }),
      }
    ),
    options: z.union([z.array(z.string().min(1)), z.null()]).optional(),
    is_repeatable: z.boolean().default(false),
    page_category_id: z.union([z.number(), z.null()]).optional(),
  })
  .superRefine((data, ctx) => {
    const { type, options } = data;
    if (["select", "checkbox", "radio"].includes(type)) {
      if (!Array.isArray(options) || options.length === 0) {
        ctx.addIssue({
          path: ["options"],
          code: z.ZodIssueCode.custom,
          message: "選択肢が1つ以上必要です",
        });
      }
    }
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
      key: "",
      label: "",
      type: "text", // 初期選択値を "text" に
      options: null,
      is_repeatable: false,
      page_category_id: null,
      ...initialValues, // 編集モード用に上書き
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <InputKey />
          <InputLabel />
          <SelectType />
          <SelectPageCategory />
        </div>
        <InputOptionsArray />
        <Button type="submit">{submitLabel}</Button>
      </form>
    </Form>
  );
}
