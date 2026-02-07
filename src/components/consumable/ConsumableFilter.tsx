"use client";

import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";
import { mockConsumableCategories } from "@/data/mockCategories";

export function ConsumableFilter() {
  const categoryOptions = [
    { value: "", label: "すべてのカテゴリー" },
    ...mockConsumableCategories.map((cat) => ({
      value: cat.id,
      label: cat.name,
    })),
  ];

  const sortOptions = [
    { value: "stock", label: "残量順" },
    { value: "name", label: "名前順" },
  ];

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex-1">
        <SearchInput placeholder="消耗品を検索..." />
      </div>
      <div className="flex gap-2">
        <Select options={categoryOptions} className="w-40" defaultValue="" />
        <Select options={sortOptions} className="w-32" defaultValue="stock" />
      </div>
    </div>
  );
}
