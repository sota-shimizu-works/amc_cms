"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function FormSkeleton() {
  return (
    <div className="space-y-6 px-4 mx-auto">
      {/* チェックボックス */}
      <Skeleton className="h-5 w-[150px]" />

      {/* 1行2列の入力フォーム */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* メタタイトル */}
      <Skeleton className="h-10 w-full" />

      {/* メタディスクリプション */}
      <Skeleton className="h-[80px] w-full" />

      {/* ボタン */}
      <Skeleton className="h-10 w-[120px]" />
    </div>
  );
}
