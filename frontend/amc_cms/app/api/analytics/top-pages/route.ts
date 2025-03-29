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

    const url = new URL(req.url);

    // --- limitパラメータ処理（件数指定） ---
    const limitParam = url.searchParams.get("limit");
    const limit = Number(limitParam);
    const safeLimit = !isNaN(limit) && limit > 0 ? limit : 10;

    // --- rangeパラメータ処理（期間指定） ---
    const range = url.searchParams.get("range") ?? "30days";
    const rangeMap: Record<string, string> = {
      "7days": "7daysAgo",
      "30days": "30daysAgo",
      "180days": "180daysAgo",
      "365days": "365daysAgo",
    };
    const startDate = rangeMap[range] ?? "30daysAgo"; // デフォルト30日

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
        dimensions: [{ name: "pagePath" }],
        metrics: [{ name: "screenPageViews" }],
        orderBys: [
          {
            metric: { metricName: "screenPageViews" },
            desc: true,
          },
        ],
        limit: safeLimit,
        dateRanges: [{ startDate, endDate: "today" }],
      },
    } as any);

    const rows =
      response.data.rows?.map((row) => ({
        page: row.dimensionValues?.[0].value ?? "",
        views: Number(row.metricValues?.[0].value ?? 0),
      })) ?? [];

    return NextResponse.json({ success: true, data: rows });
  } catch (e: any) {
    console.error("Analytics Top Pages API Error:", e);
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 500 }
    );
  }
}
