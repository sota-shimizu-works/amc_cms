import PageHeader from "@/components/page-header";
import { selectContact, updateRead } from "../actions";
import { formatDateTime } from "@/components/date-format";
import { User, Mail, Phone } from "lucide-react";
import MailCompletedToggle from "@/components/mail-completed-toggle";

export default async function Page({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;
  const contact = await selectContact(id);
  await updateRead(id, true);

  return (
    <>
      <div>
        <PageHeader text="お問い合わせ詳細" />

        <div className="flex justify-end items-center mb-4 gap-4">
          <div className="flex justify-end items-center gap-2">
            <span className="text-sm text-gray-400">処理状況: </span>
            <MailCompletedToggle contact={contact} />
          </div>

          <div>
            <a
              target="_blank"
              href={`mailto:${contact.email}?subject=Re:${contact.description}`}
              className="text-sm bg-inherit text-current border border-gray-300 rounded-md px-3 py-1 inline-block hover:opacity-75"
            >
              メールソフトで返信
            </a>
          </div>
        </div>

        <div className="border rounded-md">
          <div className="border-b px-4 py-4 space-y-4">
            <div className="flex justify-between items-center gap-4">
              <h2 className="text-lg">{contact.description}</h2>
              <p className="text-sm text-gray-400">
                {formatDateTime(contact.created_at)}
              </p>
            </div>
            <div className="text-sm text-gray-200 flex gap-3">
              <p className="flex gap-1 items-center">
                <User className="h-4" />
                <span>{contact.name}</span>
              </p>
              <p className="flex gap-1 items-center">
                <Mail className="h-4" />
                <span>{contact.email}</span>
              </p>
              {contact.phone && (
                <p className="flex gap-1 items-center">
                  <Phone className="h-4" />
                  <span>{contact.phone}</span>
                </p>
              )}
            </div>
          </div>
          <div className="px-4 py-6">
            <p className="text-xs text-gray-400 mb-4">お問い合わせ内容</p>
            <div className="whitespace-pre-wrap">{contact.content}</div>
          </div>
        </div>
      </div>
    </>
  );
}
