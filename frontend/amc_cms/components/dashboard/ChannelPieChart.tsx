"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type ChannelData = {
  channel: string;
  sessions: number;
};

const COLORS = [
  "#3b82f6", // Blue
  "#10b981", // Green
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#6366f1", // Indigo
  "#ec4899", // Pink
  "#14b8a6", // Teal
  "#8b5cf6", // Violet
];

// カスタムツールチップ
function CustomTooltip({ active, payload }: TooltipProps<any, any>) {
  if (active && payload && payload.length) {
    const item = payload[0];
    return (
      <div className="rounded-md border bg-background p-2 shadow-sm text-sm">
        <p className="text-muted-foreground">{item.payload.channel}</p>
        <p className="font-medium">{item.value} セッション</p>
      </div>
    );
  }
  return null;
}

// カスタムラベル（3%以上かつ小さい文字）
const renderLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  percent,
  name,
  value,
  index,
}: any) => {
  if (percent < 0.01) return null;

  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 20;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fontSize="12px"
      fill={COLORS[index % COLORS.length]} // ← セグメントに対応した色に！
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${name}: ${value}`}
    </text>
  );
};

export default function ChannelPieChart() {
  const [data, setData] = useState<ChannelData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/analytics/channels");
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

    fetchChannels();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>流入元チャネルの割合</CardTitle>
      </CardHeader>
      <CardContent className="min-h-[300px]">
        {error ? (
          <p className="text-red-500 text-sm">{error}</p>
        ) : loading ? (
          <Skeleton className="w-full h-[300px] rounded-md" />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                dataKey="sessions"
                nameKey="channel"
                cx="50%"
                cy="50%"
                outerRadius={130}
                labelLine={false}
                label={renderLabel} // ← ここで使用！
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
