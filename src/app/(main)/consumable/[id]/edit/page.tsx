import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { ConsumableForm } from "@/components/consumable/ConsumableForm";
import prisma from "@/lib/prisma";
import { toConsumableItem } from "@/lib/consumable-db";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ConsumableEditPage({ params }: PageProps) {
  const { id } = await params;
  const rawItem = await prisma.consumableItem.findUnique({ where: { id } });
  if (!rawItem) notFound();

  const item = toConsumableItem(rawItem);

  return (
    <PageContainer>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">消耗品編集</h1>
      <ConsumableForm item={item} isEdit />
    </PageContainer>
  );
}
