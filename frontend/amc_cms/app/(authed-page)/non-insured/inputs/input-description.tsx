"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { useState, useRef, useEffect } from "react";
import { EDITOR_JS_TOOLS } from "@/utils/editorTools";
import { uploadImageToSupabase } from "@/utils/uploadImageToSupabase";
import { convertBlocksToHTML } from "@/utils/convertBlocksToHTML";

type InputEditorProps = {
  name: string;
  label?: string;
  description?: string;
};

export default function InputDescription({
  name,
  label = "本文",
  description,
}: InputEditorProps) {
  const form = useFormContext();

  const [editorTools, setEditorTools] = useState(EDITOR_JS_TOOLS);
  const [editorReady, setEditorReady] = useState(false);
  const [pending, setPending] = useState(false);
  const editorRef = useRef<any>(null);
  const editorContainerRef = useRef<HTMLDivElement | null>(null);

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
            const html = convertBlocksToHTML(data.blocks);
            form.setValue(name, html);
          },
        });
      }
    }
    initializeEditor();
  }, [editorReady, editorTools]);

  return (
    <FormField
      name={name}
      render={() => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <div
              id="editorjs"
              ref={editorContainerRef}
              className="border rounded-md p-2 min-h-[300px] text-white"
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
