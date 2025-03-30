import { NextRequest, NextResponse } from "next/server";
import {
  selectConversationLogs,
  deleteConversation,
} from "@/app/(authed-page)/chat/actions";

export async function GET(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const conversation_id = pathname.split("/").pop() || ""; // `/api/chat/123` -> '123'

  const data = await selectConversationLogs(conversation_id);
  return NextResponse.json({ data });
}

export async function DELETE(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const conversation_id = pathname.split("/").pop() || "";

  const result = await deleteConversation(conversation_id);
  return NextResponse.json(result);
}
