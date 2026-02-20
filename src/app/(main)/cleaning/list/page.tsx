"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { CleaningFilter } from "@/components/cleaning/CleaningFilter";
import { CleaningListItem } from "@/components/cleaning/CleaningListItem";
import { WarningTaskCard } from "@/components/cleaning/WarningTaskCard";
import { CategoryCreateModal } from "@/components/cleaning/CategoryCreateModal";
import { OverdueAlertModal } from "@/components/cleaning/OverdueAlertModal";
import { KaizenModal } from "@/components/cleaning/KaizenModal";
import { useCleaningContext } from "@/contexts/CleaningContext";

export default function CleaningListPage() {
  const {
    filteredNormalItems,
    warningItems,
    overdueItems,
    kaizenTargetId,
    setKaizenTargetId,
    overdueAlertShown,
    setOverdueAlertShown,
  } = useCleaningContext();

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  useEffect(() => {
    if (overdueItems.length > 0 && !overdueAlertShown) {
      setOverdueAlertShown(true);
    }
  }, [overdueItems, overdueAlertShown, setOverdueAlertShown]);

  const handleStartKaizen = (itemId: string) => {
    setOverdueAlertShown(false);
    setKaizenTargetId(itemId);
  };

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">掃除一覧</h1>
        <div className="flex gap-2">
          <Link href="/cleaning/new">
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
      </div>

      <div className="mb-4">
        <CleaningFilter
          onCategoryCreate={() => setCategoryModalOpen(true)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        {/* 通常タスク一覧 */}
        <div className="space-y-3">
          {filteredNormalItems.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              掃除タスクがありません
            </p>
          ) : (
            filteredNormalItems.map((item) => (
              <CleaningListItem key={item.id} item={item} />
            ))
          )}
        </div>

        {/* 警戒タスクエリア */}
        {warningItems.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-amber-800 flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
              </svg>
              警戒タスク
            </h2>
            {warningItems.map((item) => (
              <WarningTaskCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* 消耗品リンク */}
      <div className="mt-8 text-center">
        <Link
          href="/consumable/list"
          className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
        >
          消耗品はこちらへ →
        </Link>
      </div>

      {/* モーダル群 */}
      <CategoryCreateModal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
      />

      <OverdueAlertModal
        isOpen={overdueAlertShown && !kaizenTargetId}
        onClose={() => setOverdueAlertShown(false)}
        overdueItems={overdueItems}
        onStartKaizen={handleStartKaizen}
      />

      {kaizenTargetId && (
        <KaizenModal
          isOpen={!!kaizenTargetId}
          onClose={() => setKaizenTargetId(null)}
          itemId={kaizenTargetId}
        />
      )}
    </PageContainer>
  );
}
