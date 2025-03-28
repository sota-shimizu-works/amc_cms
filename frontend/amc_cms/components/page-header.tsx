export default function PageHeader({ text }: { text: string }) {
  return (
    <div className="py-8">
      <h1 className="text-xl">{text}</h1>
    </div>
  );
}
