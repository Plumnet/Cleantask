import { PageContainer } from "@/components/layout/PageContainer";
import { CleaningForm } from "@/components/cleaning/CleaningForm";
import { mockCleaningItems } from "@/data/mockCleaning";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function CleaningEditPage({ params }: PageProps) {
  const { id } = await params;
  const item =
    mockCleaningItems.find((i) => i.id === id) || mockCleaningItems[0];

  return (
    <PageContainer>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">掃除タスク編集</h1>
      <CleaningForm item={item} isEdit />
    </PageContainer>
  );
}
