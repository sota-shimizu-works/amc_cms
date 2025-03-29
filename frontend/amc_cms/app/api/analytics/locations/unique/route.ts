import { NextRequest, NextResponse } from "next/server";
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
          .filter((item) => item.region && item.city)
          .map((item) => [`${item.region}-${item.city}`, item])
      ).values()
    );

    return NextResponse.json({ success: true, data: uniqueLocations });
  } catch (e: any) {
    console.error("Analytics API Error:", e);
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 500 }
    );
  }
}
