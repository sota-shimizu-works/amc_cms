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
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function InsuredTestForm() {
  const { id } = useParams(); // insured_id
  const [tests, setTests] = useState<any[]>([]);
  const [insuredTests, setInsuredTests] = useState<any[]>([]);
  const [selectedTestId, setSelectedTestId] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  async function fetchTests() {
    const res = await fetch("/api/tests"); // APIがある前提
    if (res.ok) {
      const data = await res.json();
      setTests(data);
    }
  }

  async function fetchInsuredTests() {
    const res = await fetch(`/api/insured-tests?insured_id=${id}`);
    if (res.ok) {
      const data = await res.json();
      setInsuredTests(data);
    }
  }

  useEffect(() => {
    fetchTests();
    fetchInsuredTests();
  }, [id]);

  async function handleAddTest() {
    if (!selectedTestId) return;

    const res = await fetch("/api/insured-tests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ insured_id: Number(id), test_id: selectedTestId }),
    });

    if (res.ok) {
      toast.success("検査を追加しました");
      setDialogOpen(false);
      setSelectedTestId(null);
      fetchInsuredTests();
    } else {
      toast.error("追加に失敗しました");
    }
  }

  async function handleDelete(insuredTestId: number) {
    if (!confirm("本当に削除しますか？")) return;

    const res = await fetch(`/api/insured-tests/${insuredTestId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      toast.success("削除しました");
      fetchInsuredTests();
    } else {
      toast.error("削除に失敗しました");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>検査を追加</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>検査を追加</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Select
                onValueChange={(value) => setSelectedTestId(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="検査を選択" />
                </SelectTrigger>
                <SelectContent>
                  {tests.map((test) => (
                    <SelectItem key={test.id} value={String(test.id)}>
                      {test.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex justify-end gap-2">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    キャンセル
                  </Button>
                </DialogClose>
                <Button onClick={handleAddTest}>追加</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {insuredTests.map((item) => (
          <div
            key={item.id}
            className="border p-4 rounded-md flex justify-between items-center"
          >
            <div>
              <div className="font-bold">{item.test?.name}</div>
              <div className="text-sm text-muted-foreground">
                {item.test?.slug}
              </div>
            </div>
            <Button variant="destructive" onClick={() => handleDelete(item.id)}>
              削除
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
