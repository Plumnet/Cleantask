import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { toConsumableItem } from "@/lib/consumable-db";
import { PageContainer } from "@/components/layout/PageContainer";
import { ReceiptScanner } from "@/components/consumable/ReceiptScanner";

type SearchParams = Promise<{ itemId?: string }>;

export default async function ReceiptPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { itemId } = await searchParams;
  if (!itemId) notFound();

  const raw = await prisma.consumableItem.findUnique({ where: { id: itemId } });
  if (!raw) notFound();

  const item = toConsumableItem(raw);

  return (
    <PageContainer>
      <ReceiptScanner item={item} />
    </PageContainer>
  );
}
