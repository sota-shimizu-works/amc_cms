"use client";
import { useLeafletMap, CoordinateWithAccess } from "@/hooks/useLeafletMap";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const Map = ({ points }: { points: CoordinateWithAccess[] }) => {
  const mapRef = useLeafletMap([35.681236, 139.767125], points); // 東京駅

  return (
    <Card>
      <CardHeader>
        <CardTitle>アクセスヒートマップ</CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={mapRef} className="w-full h-[500px] rounded-md" />
      </CardContent>
    </Card>
  );
};
