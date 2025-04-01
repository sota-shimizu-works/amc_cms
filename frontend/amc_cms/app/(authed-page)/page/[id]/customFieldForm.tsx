"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomFieldDefinition } from "@/utils/types";
import FormSkeleton from "@/components/skeletons/FormSkeleton";

const fieldValueSchema = z.object({
  field_key: z.string(),
  value: z.any(),
  sort_order: z.number().optional(),
});

const formSchema = z.object({
  fields: z.array(fieldValueSchema),
});

type FormValues = z.infer<typeof formSchema>;

type MergedField = {
  field_key: string;
  value: any;
  sort_order: number;
  definition: CustomFieldDefinition;
};

export default function PageCustomFieldForm() {
  const { id } = useParams();
  const pageId = Number(id);

  const [mergedFields, setMergedFields] = useState<MergedField[]>([]);
  const [allDefinitions, setAllDefinitions] = useState<CustomFieldDefinition[]>(
    []
  );
  const [selectedKey, setSelectedKey] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [deletedKeys, setDeletedKeys] = useState<string[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { fields: [] },
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const pageRes = await fetch(`/api/pages/${pageId}`);
      const page = await pageRes.json();
      const [valueRes, allDefRes] = await Promise.all([
        fetch(`/api/pages/${pageId}/custom-fields`),
        fetch(`/api/custom-field-definitions`),
      ]);
      const values = await valueRes.json();
      const allDefs: CustomFieldDefinition[] = await allDefRes.json();

      const merged: MergedField[] = allDefs
        .filter((def) => {
          const hasValue = values.some((v: any) => v.field_key === def.key);
          const isFromCategory =
            page.category_id !== null &&
            def.page_category_id === page.category_id;
          return hasValue || isFromCategory;
        })
        .map((def) => {
          const match = values.find((v: any) => v.field_key === def.key);
          return {
            field_key: def.key,
            value: match?.value ?? (def.type === "checkbox" ? [] : ""),
            sort_order: match?.sort_order ?? 0,
            definition: def,
          };
        })
        .sort((a, b) => {
          const aCat =
            a.definition.page_category_id === page.category_id ? 0 : 1;
          const bCat =
            b.definition.page_category_id === page.category_id ? 0 : 1;
          return aCat - bCat;
        });

      setMergedFields(merged);
      setAllDefinitions(allDefs);
      form.reset({
        fields: merged.map(({ field_key, value, sort_order }) => ({
          field_key,
          value,
          sort_order,
        })),
      });
      setIsLoading(false);
    };
    fetchData();
  }, [pageId]);

  const onSubmit = async (values: FormValues) => {
    const res = await fetch(`/api/pages/${pageId}/custom-fields`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fields: values.fields, deletedKeys }),
    });
    if (!res.ok) alert("保存に失敗しました");
    else {
      alert("保存しました");
      setDeletedKeys([]);
    }
  };

  const renderField = (field: CustomFieldDefinition, index: number) => {
    const name = `fields.${index}.value` as const;
    const common = { control: form.control, name };

    const wrapField = (children: React.ReactNode) => (
      <div className="flex items-center gap-2">
        <FormControl className="flex-1">{children}</FormControl>
        {field.page_category_id === null && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => {
              setMergedFields((prev) =>
                prev.filter((f) => f.field_key !== field.key)
              );
              const updatedFields = form
                .getValues("fields")
                .filter((f) => f.field_key !== field.key);
              form.setValue("fields", updatedFields);
              setDeletedKeys((prev) => [...prev, field.key]);
            }}
          >
            削除
          </Button>
        )}
      </div>
    );

    switch (field.type) {
      case "text":
      case "date":
        return (
          <FormField
            {...common}
            render={({ field: f }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                {wrapField(
                  <Input
                    type={field.type === "date" ? "date" : "text"}
                    value={f.value ?? ""}
                    onChange={f.onChange}
                  />
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case "textarea":
        return (
          <FormField
            {...common}
            render={({ field: f }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                {wrapField(
                  <Textarea value={f.value ?? ""} onChange={f.onChange} />
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case "checkbox":
        return (
          <FormField
            {...common}
            render={({ field: f }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <div className="space-y-1">
                    {(field.options || []).map((opt) => (
                      <label key={opt} className="flex items-center gap-2">
                        <Checkbox
                          checked={
                            Array.isArray(f.value) && f.value.includes(opt)
                          }
                          onCheckedChange={(checked) => {
                            const current = Array.isArray(f.value)
                              ? [...f.value]
                              : [];
                            if (checked) f.onChange([...current, opt]);
                            else f.onChange(current.filter((v) => v !== opt));
                          }}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case "select":
      case "radio":
        return (
          <FormField
            {...common}
            render={({ field: f }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                {wrapField(
                  <Select
                    value={f.value ?? ""}
                    onValueChange={(val) => f.onChange(val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      {(field.options || []).map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );
      default:
        return null;
    }
  };

  const availableToAdd = allDefinitions.filter(
    (def) => !mergedFields.some((m) => m.field_key === def.key)
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-4">
        {isLoading ? (
          <FormSkeleton />
        ) : (
          <>
            {mergedFields.map((m, index) => (
              <div key={m.field_key}>{renderField(m.definition, index)}</div>
            ))}
            {availableToAdd.length > 0 && (
              <div className="space-y-3">
                <FormLabel className="min-w-[150px]">
                  カスタムフィールドを追加
                </FormLabel>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Select
                      value={selectedKey}
                      onValueChange={(val) => setSelectedKey(val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="選択してください" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableToAdd.map((def) => (
                          <SelectItem key={def.key} value={def.key}>
                            {def.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="button"
                    onClick={() => {
                      if (!selectedKey) return;
                      const def = availableToAdd.find(
                        (d) => d.key === selectedKey
                      );
                      if (!def) return;
                      const newField: MergedField = {
                        field_key: def.key,
                        value: def.type === "checkbox" ? [] : "",
                        sort_order: 999,
                        definition: def,
                      };
                      setMergedFields((prev) => [...prev, newField]);
                      form.setValue("fields", [
                        ...form.getValues("fields"),
                        {
                          field_key: def.key,
                          value: def.type === "checkbox" ? [] : "",
                          sort_order: 999,
                        },
                      ]);
                      setSelectedKey("");
                    }}
                  >
                    ＋追加
                  </Button>
                </div>
                <div className="pt-4">
                  <Button type="submit">カスタムフィールドを保存</Button>
                </div>
              </div>
            )}
          </>
        )}
      </form>
    </Form>
  );
}
