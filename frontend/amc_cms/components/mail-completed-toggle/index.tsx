"use client";

import { useState, useTransition } from "react";
import { Contact } from "@/utils/types";
import { Switch } from "@/components/ui/switch";
import { updateCompleted } from "./actions";

export default function MailCompletedToggle({ contact }: { contact: Contact }) {
  const [isCompleted, setIsCompleted] = useState(contact.is_completed);
  const [isPending, startTransition] = useTransition();

  return (
    <Switch
      checked={isCompleted}
      disabled={isPending} // 更新中はトグルを無効化
      onCheckedChange={(checked) => {
        setIsCompleted(checked); // 状態を即時更新
        startTransition(async () => {
          try {
            await updateCompleted(contact.id, checked);
          } catch (error) {
            console.error("更新エラー:", error);
            setIsCompleted(!checked); // 失敗時は元に戻す
          }
        });
      }}
    />
  );
}
