"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function TestReportForm() {
  const { id } = useParams(); // test_id
  const [reports, setReports] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reportTitle, setReportTitle] = useState("");
  const [selectedFileId, setSelectedFileId] = useState<number | null>(null);

  async function fetchReports() {
    const res = await fetch(`/api/test-reports?test_id=${id}`);
    if (res.ok) {
      const data = await res.json();
      setReports(data);
    }
  }

  async function fetchFiles() {
    const res = await fetch("/api/files");
    if (res.ok) {
      const data = await res.json();
      setFiles(data);
    }
  }

  useEffect(() => {
    fetchReports();
    fetchFiles();
  }, [id]);

  async function handleAddReport() {
    if (!reportTitle || !selectedFileId) {
      toast.error("レポート名とファイルを選択してください");
      return;
    }

    const res = await fetch("/api/test-reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        test_id: Number(id),
        title: reportTitle,
        file_id: selectedFileId,
      }),
    });

    if (res.ok) {
      toast.success("レポートを追加しました");
      setDialogOpen(false);
      setReportTitle("");
      setSelectedFileId(null);
      fetchReports();
    } else {
      toast.error("追加に失敗しました");
    }
  }

  async function handleDelete(reportId: number) {
    if (!confirm("本当に削除しますか？")) return;

    const res = await fetch(`/api/test-reports/${reportId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      toast.success("削除しました");
      fetchReports();
    } else {
      toast.error("削除に失敗しました");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>レポートを追加</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>レポートを追加</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">レポート名</Label>
                <Input
                  id="title"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder="例: 血液検査レポート"
                />
              </div>

              <div>
                <Label htmlFor="file">ファイル選択</Label>
                <Select
                  onValueChange={(value) => setSelectedFileId(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="ファイルを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {files.map((file) => (
                      <SelectItem key={file.id} value={String(file.id)}>
                        {file.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    キャンセル
                  </Button>
                </DialogClose>
                <Button onClick={handleAddReport}>追加</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {reports.map((report) => (
          <div
            key={report.id}
            className="border p-4 rounded-md flex justify-between items-center"
          >
            <div>
              <div className="font-bold">{report.title}</div>
              <div className="text-sm text-muted-foreground">
                {report.file?.name}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {report.file?.url && (
                <a
                  href={report.file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm">
                    確認
                  </Button>
                </a>
              )}
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(report.id)}
              >
                削除
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
