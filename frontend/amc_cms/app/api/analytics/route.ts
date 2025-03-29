import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

// base64の認証情報を.envから復号してJSONに
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

    const range = url.searchParams.get("range") ?? "7days";

    let startDate = "7daysAgo";

    switch (range) {
      case "30days":
        startDate = "30daysAgo";
        break;
      case "180days":
        startDate = "180daysAgo";
        break;
      case "365days":
        startDate = "365daysAgo";
        break;
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
        dimensions: [{ name: "date" }],
        metrics: [{ name: "screenPageViews" }],
        dateRanges: [{ startDate, endDate: "today" }],
        orderBys: [
          {
            dimension: { dimensionName: "date" },
            desc: false,
          },
        ],
      },
    });

    const rows =
      response.data.rows?.map((row) => ({
        date: row.dimensionValues?.[0].value ?? "",
        views: Number(row.metricValues?.[0].value ?? 0),
      })) ?? [];

    return NextResponse.json({ success: true, data: rows });
  } catch (e: any) {
    console.error("Analytics API Error:", e);
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 500 }
    );
  }
}
