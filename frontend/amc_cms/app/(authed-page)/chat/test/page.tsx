import PageHeader from "@/components/page-header";
import ChatBox from "@/components/dify/chatBox";
import RagTest from "@/components/rag/RagTest";

export default function Page() {
  return (
    <>
      <div>
        <PageHeader text="チャットボットテスト" />
        <p className="text-sm text-gray-600 mb-4">
          チャットボットの動作確認用ページです。
          <br />
          RAG用学習素材の追加後などに情報が反映されているかなどを確認する際にご利用ください。
        </p>
        <div className="mb-4">
          <ChatBox />
        </div>
        <hr className="mb-4" />
        <div>
          <RagTest />
        </div>
      </div>
    </>
  );
}
