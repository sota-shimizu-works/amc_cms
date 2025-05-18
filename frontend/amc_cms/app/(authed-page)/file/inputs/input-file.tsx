"use client";

import { useFormContext } from "react-hook-form";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { uploadFileToSupabase } from "@/utils/uploadImageToSupabase";
import { useState, useCallback, useRef } from "react";
import { CheckCircle, ExternalLink } from "lucide-react";

/**
 * サイズを KB / MB で表示する補助関数
 */
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export default function InputFile() {
  const form = useFormContext();
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const url = form.watch("url");
  const size = form.watch("size");
  const type = form.watch("type");

  const fileName = url ? decodeURIComponent(url.split("/").pop() || "") : "";
  const fileExt = type ? type.split("/").pop() : fileName.split(".").pop();

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const result = await uploadFileToSupabase(file);

      form.setValue("path", result.path);
      form.setValue("url", result.url);
      form.setValue("size", result.size);
      form.setValue("type", result.type);
    } catch (error) {
      console.error("アップロード失敗:", error);
    } finally {
      setUploading(false);
    }
  };

  const onFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) await handleUpload(file);
    },
    []
  );

  const onDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) await handleUpload(file);
  }, []);

  const borderClass = uploading
    ? "border-yellow-400 bg-yellow-50"
    : url
      ? "border-green-400 bg-green-50"
      : dragOver
        ? "border-blue-400 bg-blue-50"
        : "border-gray-300 hover:border-gray-400";

  return (
    <FormItem>
      <FormLabel>ファイル</FormLabel>
      <FormControl>
        <div>
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer transition text-sm ${borderClass}`}
          >
            {uploading ? (
              <p className="text-gray-600">アップロード中...</p>
            ) : url ? (
              <div className="flex items-center text-green-700 gap-2">
                <CheckCircle size={18} className="text-green-600" />
                <span>ファイルが設定されています</span>
              </div>
            ) : (
              <p className="text-gray-600">
                ここにファイルをドラッグ＆ドロップ、またはクリックして選択
              </p>
            )}

            {url && (
              <div className="mt-1 text-xs text-gray-500 text-center space-y-1">
                <p className="truncate">{fileName}</p>
                {(fileExt || size) && (
                  <p>
                    {fileExt && (
                      <span className="mr-2">拡張子: .{fileExt}</span>
                    )}
                    {size && <span>サイズ: {formatBytes(size)}</span>}
                  </p>
                )}
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            onChange={onFileChange}
            className="hidden"
          />
        </div>
      </FormControl>

      <FormDescription>
        アップロードすると自動で情報が登録されます。
      </FormDescription>

      {url && (
        <Button
          asChild
          variant="outline"
          className="mt-3 border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:border-blue-400 dark:text-blue-300 dark:hover:bg-blue-900 dark:hover:text-blue-100"
        >
          <a href={url} target="_blank" rel="noopener noreferrer">
            <ExternalLink size={16} className="mr-1" />
            ファイルを確認
          </a>
        </Button>
      )}

      <FormMessage />
    </FormItem>
  );
}
