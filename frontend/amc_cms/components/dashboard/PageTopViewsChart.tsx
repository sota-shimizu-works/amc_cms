"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  TooltipProps,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type PageView = {
  page: string;
  views: number;
};

function CustomTooltip({ active, payload }: TooltipProps<any, any>) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-md border bg-background p-2 shadow-sm text-sm">
        <p className="font-medium">アクセス数: {payload[0].value} 件</p>
      </div>
    );
  }
  return null;
}

export default function PageTopViewsChart() {
  const [data, setData] = useState<PageView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchViews = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(
          "/api/analytics/top-pages?limit=10&range=30days"
        );
        const result = await res.json();

        if (!result.success) {
          setError(result.error ?? "データ取得に失敗しました");
          return;
        }

        setData(result.data);
      } catch (e) {
        setError("ネットワークエラー");
      } finally {
        setLoading(false);
      }
    };

    fetchViews();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>ページ別アクセス数（上位10件）</CardTitle>
      </CardHeader>
      <CardContent className="min-h-[300px]">
        {error ? (
          <p className="text-red-500 text-sm">{error}</p>
        ) : loading ? (
          <Skeleton className="w-full h-[300px] rounded-md" />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              layout="vertical"
              data={data}
              margin={{ top: 10, right: 40, left: 20, bottom: 10 }} // ← グラフエリアを広めに
            >
              <XAxis type="number" />
              <YAxis
                dataKey="page"
                type="category"
                width={140} // ← ラベル幅を縮小（100〜160くらい）
                tick={{
                  fontSize: 12,
                }}
                tickFormatter={(value: string) =>
                  value.length > 20 ? value.slice(0, 20) + "..." : value
                } // ← ラベル省略！
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="views" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
