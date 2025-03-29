"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat"; // ヒートマップ対応

export type CoordinateWithAccess = {
  lat: number;
  lng: number;
  accessCount: number;
};

const useLeafletMap = (
  center: [number, number],
  points: CoordinateWithAccess[] = []
) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && mapRef.current) {
      const map = L.map(mapRef.current).setView(center, 11);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      const heatPoints: [number, number, number][] = points.map((loc) => [
        loc.lat,
        loc.lng,
        loc.accessCount,
      ]);

      const maxAccess = Math.max(...points.map((p) => p.accessCount));

      const heatLayer = L.heatLayer(heatPoints, {
        radius: 40,
        blur: 70,
        maxZoom: 11,
        max: maxAccess || 1, // 0除算回避
      }).addTo(map);

      return () => {
        map.remove();
      };
    }
  }, [center, points]);

  return mapRef;
};

export { useLeafletMap };
