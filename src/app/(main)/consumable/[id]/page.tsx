import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { ConsumableDetailContent } from "@/components/consumable/ConsumableDetailContent";
import prisma from "@/lib/prisma";
import { toConsumableItem, toStockOutRecord } from "@/lib/consumable-db";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ConsumableDetailPage({ params }: PageProps) {
  const { id } = await params;

  const rawItem = await prisma.consumableItem.findUnique({ where: { id } });
  if (!rawItem) notFound();

  const rawRecords = await prisma.stockOutRecord.findMany({
    where: { consumableId: id },
    orderBy: { date: "desc" },
    take: 10,
  });

  const item = toConsumableItem(rawItem);
  const stockOutRecords = rawRecords.map(toStockOutRecord);

  return (
    <PageContainer>
      <ConsumableDetailContent item={item} stockOutRecords={stockOutRecords} />
    </PageContainer>
  );
}
