"use client";

import { Category } from "@/utils/types";
import { useState, useRef, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EDITOR_JS_TOOLS } from "@/utils/editorTools";
import { convertBlocksToHTML } from "@/utils/convertBlocksToHTML";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import * as React from "react";
import { format } from "date-fns";
import { uploadImageToSupabase } from "@/utils/uploadImageToSupabase";
import { insertArticle, navigate } from "../actions";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().nonempty(),
  content: z.any().optional(),
  is_published: z.boolean(),
  published_at: z.string().nullable().optional(),
  selected_categories: z.array(z.number()).optional(),
});

export default function ClientForm({ categories }: { categories: Category[] }) {
  const [editorTools, setEditorTools] = useState(EDITOR_JS_TOOLS);
  const [editorReady, setEditorReady] = useState(false);
  const [pending, setPending] = useState(false);
  const editorRef = useRef<any>(null);
  const editorContainerRef = useRef<HTMLDivElement | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      is_published: true,
      published_at: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      selected_categories: [],
    },
  });

  // 画像ツールを動的に追加

  useEffect(() => {
    async function loadEditorTools() {
      if (typeof window !== "undefined") {
        const { default: ImageTool } = await import("@editorjs/image");

        setEditorTools((prevTools) => ({
          ...prevTools,
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  try {
                    console.log("Uploading file to Supabase:", file);
                    const url = await uploadImageToSupabase(file);
                    console.log("Uploaded image URL:", url);
                    return { success: 1, file: { url } };
                  } catch (error) {
                    console.error("画像アップロードエラー:", error);
                    return { success: 0 };
                  }
                },
              },
            },
          },
        }));

        setEditorReady(true);
      }
    }

    loadEditorTools();
  }, []);

  // Editor.js の初期化
  useEffect(() => {
    async function initializeEditor() {
      if (
        typeof window !== "undefined" &&
        editorContainerRef.current &&
        editorReady
      ) {
        const EditorJS = (await import("@editorjs/editorjs")).default;

        editorRef.current = new EditorJS({
          holder: "editorjs",
          tools: editorTools,
          autofocus: true,
          placeholder: "ここに本文を入力してください...",
          data: { blocks: [] },
          onChange: async () => {
            const data = await editorRef.current?.save();
            console.log("Editor.js の変更:", data);
            form.setValue("content", JSON.stringify(data));
          },
        });
      }
    }
    initializeEditor();
  }, [editorReady, editorTools]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (editorRef.current) {
      const editorData = await editorRef.current.save();
      const htmlContent = convertBlocksToHTML(editorData.blocks);
      form.setValue("content", htmlContent);
    }

    setPending(true);
    try {
      const res = await insertArticle({
        title: form.getValues().title,
        content: form.getValues().content,
        is_published: form.getValues().is_published,
        published_at: form.getValues().published_at || "",
        selected_categories: form.getValues().selected_categories || [],
      });
      toast("記事を投稿しました");
      navigate(res);
    } catch (error) {
      console.log("記事更新エラー:", error);
      toast("記事の更新に失敗しました");
    }
    setPending(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex-row lg:flex justify-between gap-8 lg:flex-row-reverse space-y-8">
          <div className="w-full space-y-8 lg:min-w-[300px] lg:max-w-[300px]">
            <Button type="submit" disabled={pending} className="w-full">
              {pending ? "更新中..." : "更新"}
            </Button>

            <FormField
              name="is_published"
              render={() => (
                <FormItem>
                  <FormLabel>公開設定</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        form.setValue("is_published", value === "公開");
                      }}
                      defaultValue="公開"
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="公開状態を選択してください" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="公開">公開</SelectItem>
                        <SelectItem value="非公開">非公開</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="published_at"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>公開日時</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="selected_categories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>カテゴリ</FormLabel>
                  <FormControl>
                    <div className="space-y-2 border rounded-md p-4 max-h-[240px] overflow-y-scroll">
                      {categories.map((category) => (
                        <div
                          key={category.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            checked={field.value?.includes(category.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                form.setValue("selected_categories", [
                                  ...(field.value as number[]),
                                  category.id,
                                ]);
                              } else {
                                form.setValue(
                                  "selected_categories",
                                  (field.value as number[]).filter(
                                    (id) => id !== category.id
                                  )
                                );
                              }
                            }}
                          />
                          <label className="text-sm">{category.name}</label>
                        </div>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-8 w-full md:min-w-[610px]">
            <FormField
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="タイトルを入力してください"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="content"
              render={() => (
                <FormItem>
                  <FormLabel>本文</FormLabel>
                  <FormControl>
                    <div
                      id="editorjs"
                      ref={editorContainerRef}
                      className="border rounded-md p-2 min-h-[300px] text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
  );
}
