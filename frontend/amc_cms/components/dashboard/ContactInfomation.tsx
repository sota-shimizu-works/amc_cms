"use client";

import { useEffect, useState } from "react";
import { Contact } from "@/utils/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function ContactInfomation() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setError(null);
        setLoading(true);
        const res = await fetch("/api/contacts");
        const result = await res.json();

        if (!result.success) {
          setError(result.error ?? "データ取得に失敗しました");
          return;
        }

        setContacts(result.data);
      } catch (e) {
        setError("ネットワークエラー");
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center">
        <Skeleton className="h-12" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>エラー</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!loading && contacts.length !== 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>お問い合わせ</AlertTitle>
        <AlertDescription>
          未読のお問い合わせが{" "}
          <Link href="/contact" className="text-green-600">
            {contacts.length}件
          </Link>
          あります
        </AlertDescription>
      </Alert>
    );
  }
}
