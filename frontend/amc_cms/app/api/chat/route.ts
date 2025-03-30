import { NextResponse } from "next/server";
import { selectConversations } from "@/app/(authed-page)/chat/actions";

export async function GET() {
  const data = await selectConversations();
  return NextResponse.json({ data });
}
