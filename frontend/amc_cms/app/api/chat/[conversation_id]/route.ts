import { NextRequest, NextResponse } from "next/server";
import {
  selectConversationLogs,
  deleteConversation,
} from "@/app/(authed-page)/chat/actions";

export async function GET(
  req: NextRequest,
  { params }: { params: { conversation_id: string } }
) {
  const data = await selectConversationLogs(params.conversation_id);
  return NextResponse.json({ data });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { conversation_id: string } }
) {
  const result = await deleteConversation(params.conversation_id);
  return NextResponse.json(result);
}
