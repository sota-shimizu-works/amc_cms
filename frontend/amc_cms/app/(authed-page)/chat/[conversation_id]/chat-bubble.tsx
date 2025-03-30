// @/app/(authed-page)/chat/[conversation_id]/chat-bubble.tsx
import React from "react";
import clsx from "clsx";

type Props = {
  type: "user" | "bot";
  message: string;
};

export default function ChatBubble({ type, message }: Props) {
  const isUser = type === "user";
  return (
    <div className={clsx("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={clsx(
          "rounded-2xl px-4 py-2 max-w-[70%] whitespace-pre-wrap",
          isUser
            ? "bg-blue-600 text-white rounded-br-none"
            : "bg-gray-200 text-black rounded-bl-none"
        )}
      >
        {message}
      </div>
    </div>
  );
}
