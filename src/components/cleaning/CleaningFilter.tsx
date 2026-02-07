"use client";

import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";
import { mockCategories } from "@/data/mockCategories";

export function CleaningFilter() {
  const categoryOptions = [
    { value: "", label: "すべてのカテゴリー" },
    ...mockCategories.map((cat) => ({ value: cat.id, label: cat.name })),
  ];

  const sortOptions = [
    { value: "nextCleaningAt", label: "次回掃除日" },
    { value: "name", label: "名前順" },
    { value: "lastCleanedAt", label: "最終掃除日" },
  ];

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex-1">
        <SearchInput placeholder="掃除タスクを検索..." />
      </div>
      <div className="flex gap-2">
        <Select options={categoryOptions} className="w-40" defaultValue="" />
        <Select
          options={sortOptions}
          className="w-36"
          defaultValue="nextCleaningAt"
        />
      </div>
    </div>
  );
}
