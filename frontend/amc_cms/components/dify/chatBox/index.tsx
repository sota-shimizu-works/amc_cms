"use client";

import React, { useState } from "react";
import clsx from "clsx";

export default function ChatBox() {
  const [messages, setMessages] = useState<
    {
      role: "user" | "bot";
      text: string;
    }[]
  >([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const sendMessage = async () => {
    if (!query.trim()) return;
    const newMessages: { role: "user" | "bot"; text: string }[] = [
      ...messages,
      { role: "user", text: query },
    ];
    setMessages(newMessages);
    setQuery("");
    setIsLoading(true);

    const res = await fetch("/api/chat/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, conversation_id: conversationId }),
    });

    if (!res.ok) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "エラーが発生しました。" },
      ]);
      setIsLoading(false);
      return;
    }

    const reader = res.body?.getReader();
    const decoder = new TextDecoder("utf-8");
    let done = false;
    let botResponse = "";

    while (!done && reader) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;

      const chunk = decoder.decode(value);
      const lines = chunk
        .split("\n")
        .filter((line) => line.startsWith("data: "));

      for (const line of lines) {
        const jsonStr = line.replace(/^data: /, "");
        if (jsonStr === "[DONE]") continue;

        try {
          const parsed = JSON.parse(jsonStr);
          const answer = parsed?.answer;
          const newConversationId = parsed?.conversation_id;
          if (newConversationId && !conversationId) {
            setConversationId(newConversationId);
          }
          if (answer) {
            botResponse += answer;
            setMessages((prev) => {
              const updated = [...prev];
              const last = updated[updated.length - 1];
              if (last?.role === "bot") {
                last.text = botResponse;
              } else {
                updated.push({ role: "bot", text: botResponse });
              }
              return [...updated];
            });
          }
        } catch (err) {
          console.warn("JSON parse error:", err, line);
        }
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="h-[400px] overflow-y-auto flex flex-col gap-4 mb-4 border p-4 rounded">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={clsx("max-w-[80%] px-4 py-2 rounded-xl", {
              "self-end bg-blue-500 text-white": msg.role === "user",
              "self-start bg-white text-black border": msg.role === "bot",
            })}
          >
            {msg.text}
          </div>
        ))}
        {isLoading && (
          <div className="self-start text-sm text-gray-500">Botが入力中...</div>
        )}
      </div>

      <div className="flex gap-2">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          rows={1}
          placeholder="メッセージを入力..."
          className="flex-1 border rounded px-3 py-2 resize-none"
        />
        <button
          onClick={sendMessage}
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          送信
        </button>
      </div>
    </div>
  );
}
