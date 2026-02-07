import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { CleaningFilter } from "@/components/cleaning/CleaningFilter";
import { CleaningListItem } from "@/components/cleaning/CleaningListItem";
import { mockCleaningItems } from "@/data/mockCleaning";

export default function CleaningListPage() {
  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">掃除一覧</h1>
        <Link href="/cleaning/create">
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
        <CleaningFilter />
      </div>

      <div className="space-y-3">
        {mockCleaningItems.map((item) => (
          <CleaningListItem key={item.id} item={item} />
        ))}
      </div>
    </PageContainer>
  );
}
