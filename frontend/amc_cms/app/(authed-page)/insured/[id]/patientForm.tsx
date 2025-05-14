"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import FormSkeleton from "@/components/skeletons/FormSkeleton";

const schema = z.object({
  name: z.string().min(1, "対象は必須です"),
  slug: z.string().min(1, "スラッグは必須です"),
  description: z.string().min(1, "説明は必須です"),
});

type FormValues = z.infer<typeof schema>;

export default function PatientForm() {
  const { id } = useParams(); // insured_id
  const router = useRouter();
  const [patients, setPatients] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", slug: "", description: "" },
  });

  async function fetchPatients() {
    setLoading(true);
    const res = await fetch(`/api/insured_patients?insured_id=${id}`);
    if (res.ok) {
      const data = await res.json();
      setPatients(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchPatients();
  }, [id]);

  async function onSubmit(values: FormValues) {
    const endpoint = editingId
      ? `/api/insured_patients/${editingId}`
      : "/api/insured_patients";
    const payload = editingId ? values : { ...values, insured_id: Number(id) };

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      toast.success(editingId ? "更新しました" : "追加しました");
      form.reset();
      setEditingId(null);
      setDialogOpen(false);
      fetchPatients();
    } else {
      toast.error("送信に失敗しました");
    }
  }

  async function handleEdit(pid: number) {
    const res = await fetch(`/api/insured_patients/${pid}`);
    if (res.ok) {
      const data = await res.json();
      form.reset({
        name: data.name,
        slug: data.slug,
        description: data.description,
      });
      setEditingId(pid);
      setDialogOpen(true);
    }
  }

  async function handleDelete(pid: number) {
    if (!confirm("本当に削除しますか？")) return;
    const res = await fetch(`/api/insured_patients/${pid}`, {
      method: "DELETE",
    });
    if (res.ok) {
      toast.success("削除しました");
      fetchPatients();
    } else {
      toast.error("削除に失敗しました");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                form.reset();
                setEditingId(null);
              }}
            >
              対象を追加
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? "対象を編集" : "対象を追加"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>対象</FormLabel>
                      <FormControl>
                        <Input placeholder="例：風邪" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>スラッグ</FormLabel>
                      <FormControl>
                        <Input placeholder="Cold" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>説明</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="対象の説明を入力して下さい。"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      キャンセル
                    </Button>
                  </DialogClose>
                  <Button type="submit">
                    {editingId ? "更新する" : "追加する"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <FormSkeleton />
      ) : (
        <div className="space-y-4">
          {patients.map((p) => (
            <div
              key={p.id}
              className="border p-4 rounded-md flex justify-between items-start"
            >
              <div>
                <div className="font-bold">{p.name}</div>
                <div className="text-sm text-muted-foreground">{p.slug}</div>
                <div className="mt-1 whitespace-pre-wrap text-sm">
                  {p.description}
                </div>
              </div>
              <div className="space-x-2">
                <Button variant="outline" onClick={() => handleEdit(p.id)}>
                  編集
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(p.id)}
                >
                  削除
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
