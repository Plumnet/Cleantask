"use client";

import { use } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { CleaningForm } from "@/components/cleaning/CleaningForm";
import { useCleaningContext } from "@/contexts/CleaningContext";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function CleaningEditPage({ params }: PageProps) {
  const { id } = use(params);
  const { items } = useCleaningContext();
  const item = items.find((i) => i.id === id);

  if (!item) {
    return (
      <PageContainer>
        <p className="text-center text-gray-500 py-8">
          タスクが見つかりませんでした
        </p>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">掃除タスク編集</h1>
      <CleaningForm item={item} isEdit />
    </PageContainer>
  );
}
