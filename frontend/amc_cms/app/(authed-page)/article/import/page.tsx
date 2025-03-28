import PageHeader from "@/components/page-header";
import Client from "./client";

export default function Page() {
  return (
    <>
      <div>
        <PageHeader text="インポート" />
        <p className="text-sm text-gray-500 mb-8">
          WordPressからXMLファイル経由でインポートできます。重複確認やフォーマット差異などの確認が可能です。
        </p>
        <Client />
      </div>
    </>
  );
}
