"use client";

import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { EditorContent, useEditor, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import { Youtube } from "@/extensions/Youtube";
import "@/styles/tiptap-editor.css";

import {
  Bold,
  Italic,
  Code,
  Underline as UnderlineIcon,
  Link as LinkIcon,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  ImageIcon,
  List as ListIcon,
  ListOrdered,
  Youtube as YoutubeIcon,
} from "lucide-react";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";

import { uploadImageToSupabase } from "@/utils/uploadImageToSupabase";

type Props = {
  name: string;
  label?: string;
  description?: string;
  placeholder?: string;
};

function Toolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  const addImage = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const url = await uploadImageToSupabase(file);
        editor.chain().focus().setImage({ src: url }).run();
      } catch {
        console.error("画像アップロードエラー");
      }
    };
    input.click();
  };

  const addLink = () => {
    const url = window.prompt("リンクのURLを入力してください");
    if (url) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    }
  };

  const addYoutube = () => {
    const url = window.prompt("YouTubeのURLを入力してください");
    const match = url?.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([\w-]+)/);
    const id = match?.[1];
    if (!id) return alert("有効なURLを入力してください");
    const embedUrl = `https://www.youtube.com/embed/${id}`;
    editor
      .chain()
      .focus()
      .insertContent({
        type: "youtube",
        attrs: {
          src: embedUrl,
          width: 560,
          height: 315,
        },
      })
      .run();
  };

  return (
    <div className="flex flex-wrap gap-2 border-b p-2 mb-2 items-center">
      {/* 見出しセレクト */}
      <select
        onChange={(e) => {
          const v = e.target.value;
          if (v === "0") editor.chain().focus().setParagraph().run();
          else
            editor
              .chain()
              .focus()
              .toggleHeading({ level: parseInt(v) as 1 | 2 | 3 | 4 | 5 })
              .run();
        }}
        value={
          editor.isActive("heading", { level: 1 })
            ? "1"
            : editor.isActive("heading", { level: 2 })
              ? "2"
              : editor.isActive("heading", { level: 3 })
                ? "3"
                : editor.isActive("heading", { level: 4 })
                  ? "4"
                  : editor.isActive("heading", { level: 5 })
                    ? "5"
                    : "0"
        }
        className="border px-2 py-1 rounded text-sm"
      >
        <option value="0">段落</option>
        <option value="1">見出し1</option>
        <option value="2">見出し2</option>
        <option value="3">見出し3</option>
        <option value="4">見出し4</option>
        <option value="5">見出し5</option>
      </select>

      {/* 書式 */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <Code className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleSubscript().run()}
      >
        <SubscriptIcon className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
      >
        <SuperscriptIcon className="w-4 h-4" />
      </button>

      {/* 整列 */}
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        <AlignLeft className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <AlignCenter className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <AlignRight className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
      >
        <AlignJustify className="w-4 h-4" />
      </button>

      {/* リスト */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <ListIcon className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="w-4 h-4" />
      </button>

      {/* テーブル */}
      <button
        type="button"
        onClick={() =>
          editor
            .chain()
            .focus()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run()
        }
      >
        表を挿入
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().addColumnBefore().run()}
      >
        列を前に追加
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().addColumnAfter().run()}
      >
        列を後に追加
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().addRowBefore().run()}
      >
        行を上に追加
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().addRowAfter().run()}
      >
        行を下に追加
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().deleteTable().run()}
      >
        表を削除
      </button>

      {/* リンク・画像・YouTube */}
      <button type="button" onClick={addLink}>
        <LinkIcon className="w-4 h-4" />
      </button>
      <button type="button" onClick={addImage}>
        <ImageIcon className="w-4 h-4" />
      </button>
      <button type="button" onClick={addYoutube}>
        <YoutubeIcon className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function InputEditor({
  name,
  label = "本文",
  description,
  placeholder = "ここに本文を入力してください",
}: Props) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const editor = useEditor({
          extensions: [
            StarterKit.configure({
              heading: { levels: [1, 2, 3, 4, 5] },
              bulletList: false,
              orderedList: false,
            }),
            Youtube,
            Table.configure({ resizable: true }),
            TableRow,
            TableHeader,
            TableCell,
            BulletList,
            OrderedList,
            ListItem,
            Underline,
            Superscript,
            Subscript,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            Image,
            Placeholder.configure({ placeholder }),
            Link.configure({
              openOnClick: false,
              autolink: true,
              HTMLAttributes: {
                class: "text-blue-600 underline",
              },
            }),
          ],
          content: field.value,
          onUpdate: ({ editor }) => {
            field.onChange(editor.getHTML());
          },
        });

        useEffect(() => {
          if (editor && field.value !== editor.getHTML()) {
            editor.commands.setContent(field.value || "");
          }
        }, [editor, field.value]);

        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <div className="border rounded-md px-4 py-2">
                <Toolbar editor={editor} />
                <EditorContent
                  editor={editor}
                  className="ProseMirror prose prose-sm max-w-none"
                />
              </div>
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
