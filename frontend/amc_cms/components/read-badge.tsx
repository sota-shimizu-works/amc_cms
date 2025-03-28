import { Mail, MailOpen } from "lucide-react";

export default function ReadBadge({ isRead }: { isRead: boolean }) {
  return (
    <span
      className={`${
        isRead ? "bg-green-500" : "bg-gray-500"
      } text-white text-xs font-bold rounded-full w-[25px] h-[25px] inline-flex items-center justify-center`}
    >
      {isRead ? (
        <MailOpen className="h-4 inline-block" />
      ) : (
        <Mail className="h-4 inline-block" />
      )}
    </span>
  );
}
