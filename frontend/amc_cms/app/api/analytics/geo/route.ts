// /app/api/analytics/geo/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  getLocationByRegionAndCity,
  insertLocation,
} from "@/app/(authed-page)/geo/actions";

// Geocoding API で緯度経度を取得
async function geocodeLocation(region: string, city: string) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const address = `${city}, ${region}, Japan`;
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`
  );
  const data = await res.json();
  const location = data.results?.[0]?.geometry?.location;
  return location
    ? {
        lat: location.lat,
        lng: location.lng,
      }
    : null;
}

import { BetaAnalyticsDataClient } from "@google-analytics/data";

function getCredentialsFromEnv() {
  const base64 = process.env.GA_CREDENTIALS_BASE64;
  if (!base64) throw new Error("Missing GA_CREDENTIALS_BASE64");

  const json = Buffer.from(base64, "base64").toString("utf-8");
  return JSON.parse(json);
}

export async function GET(req: NextRequest) {
  try {
    const credentials = getCredentialsFromEnv();
    const propertyId = process.env.GA4_PROPERTY_ID;
    if (!propertyId) {
      return NextResponse.json(
        { success: false, error: "Missing GA4_PROPERTY_ID" },
        { status: 500 }
      );
    }

    const analyticsData = new BetaAnalyticsDataClient({ credentials });

    const [response] = await analyticsData.runReport({
      property: `properties/${propertyId}`,
      dimensions: [{ name: "region" }, { name: "city" }],
      metrics: [{ name: "activeUsers" }],
      dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
    });

    const rows = response.rows || [];

    const uniqueLocations = Array.from(
      new Map(
        rows
          .map((row) => ({
            region: row.dimensionValues?.[0]?.value ?? "",
            city: row.dimensionValues?.[1]?.value ?? "",
          }))
          .filter(
            (item) => item.region && item.city && item.city !== "(not set)"
          )
          .map((item) => [`${item.region}-${item.city}`, item])
      ).values()
    );

    const result = [];
    let apiCallCount = 0;
    let skipCount = 0;

    for (const { region, city } of uniqueLocations) {
      const existing = await getLocationByRegionAndCity(region, city);
      if (existing) {
        skipCount++;
        result.push(existing);
        continue;
      }

      const geo = await geocodeLocation(region, city);
      if (!geo) continue;

      const inserted = await insertLocation({
        region,
        city,
        lat: geo.lat,
        lng: geo.lng,
      });

      apiCallCount++;
      result.push(inserted);
    }

    console.log(
      `[Geo API] 総件数: ${uniqueLocations.length}, 新規取得: ${apiCallCount}, 既存スキップ: ${skipCount}`
    );

    return NextResponse.json({ success: true, data: result });
  } catch (e: any) {
    console.error("[/api/analytics/geo] Error:", e);
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 500 }
    );
  }
}
