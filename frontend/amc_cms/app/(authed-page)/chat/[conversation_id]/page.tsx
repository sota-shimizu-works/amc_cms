import { notFound } from "next/navigation";
import ChatBubble from "./chat-bubble";
import { selectConversationLogs } from "../actions";
import { ChatLog } from "@/utils/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import dayjs from "dayjs";
dayjs.locale("ja");

export default async function ChatDetailPage({
  params,
}: {
  params: Promise<{ conversation_id: string }>;
}) {
  const { conversation_id } = await params;
  const logs: ChatLog[] = await selectConversationLogs(conversation_id);
  if (!logs || logs.length === 0) return notFound();
  const log = logs[0];

  return (
    <>
      <div className="mb-8">
        <Button asChild>
          <Link href="/chat">戻る</Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>{log.user_id || log.session_id}</CardTitle>
            <CardDescription>
              {log.user_id
                ? "管理ユーザーによる会話"
                : "匿名ユーザーによる会話"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 mb-4">
              <p className="text-sm text-gray-500">conversation id</p>
              <p className="text-base text-gray-400">{log.conversation_id}</p>
            </div>
          </CardContent>
          <CardFooter>
            <div className="space-y-1 mb-4">
              <p className="text-sm text-gray-500">発生時間</p>
              <p className="text-base text-gray-400">
                {dayjs(log.created_at).format("YYYY年MM月DD日 HH:mm")}
              </p>
            </div>
          </CardFooter>
        </Card>
        <div className="space-y-4 col-span-1 lg:col-span-2">
          <h1 className="text-xl font-bold mb-4">会話ログ</h1>
          {logs.map((log, index) => (
            <div key={index} className="space-y-4">
              <ChatBubble type="user" message={log.query} />
              <ChatBubble type="bot" message={log.answer} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
