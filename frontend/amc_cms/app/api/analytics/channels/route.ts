// app/api/analytics/channels/route.ts

import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

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

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: "https://www.googleapis.com/auth/analytics.readonly",
    });

    const analyticsData = google.analyticsdata({
      version: "v1beta",
      auth,
    });

    const response = await analyticsData.properties.runReport({
      property: `properties/${propertyId}`,
      requestBody: {
        dimensions: [{ name: "sessionDefaultChannelGroup" }],
        metrics: [{ name: "sessions" }],
        orderBys: [
          {
            metric: { metricName: "sessions" },
            desc: true,
          },
        ],
        dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      },
    });

    const rows =
      response.data.rows?.map((row) => ({
        channel: row.dimensionValues?.[0].value ?? "不明",
        sessions: Number(row.metricValues?.[0].value ?? 0),
      })) ?? [];

    return NextResponse.json({ success: true, data: rows });
  } catch (e: any) {
    console.error("Analytics Channel API Error:", e);
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 500 }
    );
  }
}
