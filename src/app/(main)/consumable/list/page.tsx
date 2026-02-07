import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { ConsumableFilter } from "@/components/consumable/ConsumableFilter";
import { ConsumableListItem } from "@/components/consumable/ConsumableListItem";
import { mockConsumableItems } from "@/data/mockConsumable";

export default function ConsumableListPage() {
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
        {mockConsumableItems.map((item) => (
          <ConsumableListItem key={item.id} item={item} />
        ))}
      </div>
    </PageContainer>
  );
}
