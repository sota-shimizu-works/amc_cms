// components/LocationMap.tsx
"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// APIのレスポンス型
type LocationWithAccess = {
  id: number;
  region: string;
  city: string;
  lat: number;
  lng: number;
  accessCount: number;
};

const DynamicMap = dynamic(() => import("./Map").then((mod) => mod.Map), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-[500px] rounded-md" />,
});

export default function LocationMap() {
  const [locations, setLocations] = useState<LocationWithAccess[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      const res = await fetch("/api/analytics/geo");
      const result = await res.json();
      if (result.success) {
        setLocations(result.data);
      }
      setLoading(false);
    };

    fetchLocations();
  }, []);

  if (loading) return <Skeleton className="w-full h-[500px] rounded-md" />;
  return <DynamicMap points={locations} />;
}
