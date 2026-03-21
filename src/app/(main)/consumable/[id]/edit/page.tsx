import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { ConsumableForm } from "@/components/consumable/ConsumableForm";
import prisma from "@/lib/prisma";
import { toConsumableItem } from "@/lib/consumable-db";
import { getCurrentUserId } from "@/lib/auth";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ConsumableEditPage({ params }: PageProps) {
  const [{ id }, userId] = await Promise.all([params, getCurrentUserId()]);
  const rawItem = await prisma.consumableItem.findFirst({ where: { id, userId } });
  if (!rawItem) notFound();

  const item = toConsumableItem(rawItem);

  return (
    <PageContainer>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">消耗品編集</h1>
      <ConsumableForm item={item} isEdit />
    </PageContainer>
  );
}
