"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, TooltipProps } from "recharts";
import { ChartContainer, ChartConfig } from "@/components/ui/chart";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import dayjs from "dayjs";

type DailyView = {
  date: string; // MM/DD
  views: number;
};

const chartConfig = {
  views: {
    label: "アクセス数",
    color: "#3b82f6",
  },
} satisfies ChartConfig;

const RANGE_LABELS: Record<string, string> = {
  "7days": "7日間",
  "30days": "30日間",
  "180days": "半年",
  "365days": "1年間",
};

function CustomTooltip({ active, payload, label }: TooltipProps<any, any>) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-md border bg-background p-2 shadow-sm text-sm">
        <p className="text-muted-foreground">日付: {label}</p>
        <p className="font-medium">アクセス数: {payload[0].value} 件</p>
      </div>
    );
  }
  return null;
}

export default function PageViewsChart() {
  const [range, setRange] = useState<
    "7days" | "30days" | "180days" | "365days"
  >("7days");
  const [data, setData] = useState<DailyView[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // ← 追加！

  useEffect(() => {
    const fetchViews = async () => {
      try {
        setError(null);
        setLoading(true); // ← 開始時にtrue
        const res = await fetch(`/api/analytics?range=${range}`);
        const result = await res.json();

        if (!result.success) {
          setError(result.error ?? "データ取得に失敗しました");
          return;
        }

        const chartData: DailyView[] = result.data.map((item: any) => ({
          date: dayjs(item.date, "YYYYMMDD").format("MM/DD"),
          views: item.views,
        }));

        setData(chartData);
      } catch (e) {
        setError("ネットワークエラー");
      } finally {
        setLoading(false); // ← 終了時にfalse
      }
    };

    fetchViews();
  }, [range]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle>アクセス数の推移（{RANGE_LABELS[range]}）</CardTitle>
        </div>
        <Select
          value={range}
          onValueChange={(val) =>
            setRange(val as "7days" | "30days" | "180days" | "365days")
          }
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="期間を選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">7日間</SelectItem>
            <SelectItem value="30days">30日間</SelectItem>
            <SelectItem value="180days">半年</SelectItem>
            <SelectItem value="365days">1年間</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="min-h-[200px]">
        {error ? (
          <div>エラー：{error}</div>
        ) : loading ? (
          <Skeleton className="w-full h-[200px] rounded-md" />
        ) : (
          <ChartContainer
            config={chartConfig}
            className="w-full overflow-x-auto"
          >
            <LineChart
              width={Math.max(data.length * 25, 600)}
              height={300}
              data={data}
            >
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Line
                dataKey="views"
                stroke="var(--color-views)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
