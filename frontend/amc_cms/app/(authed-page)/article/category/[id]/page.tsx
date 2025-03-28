import { selectCategory } from "../actions";
import ClientForm from "./clientForm";

export default async function Page({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;
  const category = await selectCategory(id);

  return (
    <>
      <div>
        <ClientForm category={category} />
      </div>
    </>
  );
}
