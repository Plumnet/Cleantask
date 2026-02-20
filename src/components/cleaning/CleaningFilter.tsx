"use client";

import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";
import { useCleaningContext } from "@/contexts/CleaningContext";

type CleaningFilterProps = {
  onCategoryCreate?: () => void;
};

export function CleaningFilter({ onCategoryCreate }: CleaningFilterProps) {
  const {
    categories,
    searchQuery,
    setSearchQuery,
    selectedCategoryId,
    setSelectedCategoryId,
    sortKey,
    setSortKey,
  } = useCleaningContext();

  const categoryOptions = [
    { value: "", label: "すべてのカテゴリー" },
    ...categories.map((cat) => ({ value: cat.id, label: cat.name })),
  ];

  const sortOptions = [
    { value: "nextAsc", label: "期限が近い順" },
    { value: "nextDesc", label: "期限が遠い順" },
    { value: "name", label: "名前順" },
  ];

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex-1">
        <SearchInput
          placeholder="掃除タスクを検索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Select
          options={categoryOptions}
          className="w-40"
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
        />
        <Select
          options={sortOptions}
          className="w-36"
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
        />
        {onCategoryCreate && (
          <button
            type="button"
            onClick={onCategoryCreate}
            className="px-3 py-2 text-sm font-medium text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50 transition-colors"
            title="カテゴリー作成"
          >
            + カテゴリー
          </button>
        )}
      </div>
    </div>
  );
}
