import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { ConsumableFilter } from "@/components/consumable/ConsumableFilter";
import { ConsumableListItem } from "@/components/consumable/ConsumableListItem";
import prisma from "@/lib/prisma";
import { toConsumableItem } from "@/lib/consumable-db";

type SearchParams = Promise<{
  q?: string;
  categoryId?: string;
  sort?: string;
}>;

export default async function ConsumableListPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { q, categoryId, sort } = await searchParams;

  const where: Record<string, unknown> = {};
  if (q) where.name = { contains: q, mode: "insensitive" };
  if (categoryId) where.categoryId = categoryId;

  const orderBy =
    sort === "name"
      ? { name: "asc" as const }
      : { currentStock: "asc" as const };

  const rawItems = await prisma.consumableItem.findMany({ where, orderBy });
  const items = rawItems.map(toConsumableItem);

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">消耗品一覧</h1>
        <Link href="/consumable/create">
          <Button>
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            新規登録
          </Button>
        </Link>
      </div>

      <div className="mb-4">
        <ConsumableFilter />
      </div>

      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            消耗品が登録されていません
          </p>
        ) : (
          items.map((item) => <ConsumableListItem key={item.id} item={item} />)
        )}
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/cleaning/list"
          className="text-blue-600 hover:underline text-sm"
        >
          掃除一覧はこちら →
        </Link>
      </div>
    </PageContainer>
  );
}
