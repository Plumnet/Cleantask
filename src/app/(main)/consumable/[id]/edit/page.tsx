import { PageContainer } from "@/components/layout/PageContainer";
import { ConsumableForm } from "@/components/consumable/ConsumableForm";
import { mockConsumableItems } from "@/data/mockConsumable";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ConsumableEditPage({ params }: PageProps) {
  const { id } = await params;
  const item =
    mockConsumableItems.find((i) => i.id === id) || mockConsumableItems[0];

  return (
    <PageContainer>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">消耗品編集</h1>
      <ConsumableForm item={item} isEdit />
    </PageContainer>
  );
}
