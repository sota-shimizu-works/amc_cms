"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { parseWordPressXml } from "./actions";
import { WordPressPost } from "@/utils/types";
import { DataTable } from "./data-table";
import { columns } from "./clumns";
import { Badge } from "@/components/ui/badge";
import { CircleCheckBig } from "lucide-react";
import {
  checkIsDuplicated,
  insertWordPressPosts,
  redirectSuccess,
} from "./actions-server";
import { Checkbox } from "@/components/ui/checkbox";

export default function Client() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<WordPressPost[]>([]);
  const [duplicated, setDuplicated] = useState<string[]>([]);
  const [isOverRide, setIsOverRide] = useState(false);

  const handleImport = async () => {
    if (!file) {
      setError("ファイルを選択してください");
      return;
    }

    setLoading(true);

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError(
        "ファイルサイズが大きすぎます（5MB以上）。投稿を分割してエクスポートしてください。"
      );
      setLoading(false);
      return;
    }

    setError(null);
    setResult([]);

    try {
      const xmlString = await readFileAsText(file);
      const data = await parseWordPressXml(xmlString);
      setResult(data);
      console.log("result", result);

      const checkData = await checkIsDuplicated(data);
      setDuplicated(checkData.map((item) => item.wordpress_post_id));
      console.log("duplicated", duplicated);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => {
        reject(new Error("ファイルの読み込みに失敗しました"));
      };
    });
  };

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    setError(null);
    setFile(e.target.files?.[0] || null);
    setLoading(false);
  };

  const sumbitImport = async () => {
    if (result.length === 0) {
      setError("ファイルを読み込んでください");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await insertWordPressPosts(result, isOverRide, duplicated);
      if (res === true) {
        redirectSuccess();
      } else {
        setError("インポートに失敗しました");
      }
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <div className="mb-8">
          <div className="flex gap-4">
            <input
              type="file"
              accept=".xml"
              onChange={(e) => handleChangeFile(e)}
              className="mb-4 border border-gray-300 rounded p-2 text-xs"
            />
            <Button onClick={() => handleImport()} disabled={loading}>
              読み込み
            </Button>
          </div>
          {error && <p className="text-red-500 text-xs">{error}</p>}
        </div>
        <hr />
        {result.length > 0 && (
          <div className="my-12">
            <div className="flex items-center gap-3 mb-4">
              <Badge>件数: {result.length}</Badge>
              <Badge className="flex gap-2 items-center bg-green-500">
                <CircleCheckBig size={14} />
                XML正常
              </Badge>
              <Badge className={`${duplicated.length > 0 && "bg-yellow-500"}`}>
                インポート済み: {duplicated.length}
              </Badge>
            </div>
            <div className="mb-4">
              <DataTable
                columns={columns}
                data={result}
                duplicated={duplicated}
              />
            </div>
            <div className="flex gap-2 mb-8">
              <Checkbox
                checked={isOverRide}
                onCheckedChange={(checked: boolean) => setIsOverRide(checked)}
              />
              <span className="text-sm items-center">
                インポート済みの記事を上書きする
              </span>
            </div>
            <div className="flex justify-end">
              <Button disabled={loading} onClick={() => sumbitImport()}>
                インポート
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
