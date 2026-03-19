"use client";

import { useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";
import { mockConsumableCategories } from "@/data/mockCategories";

export function ConsumableFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchTimeout = useRef<ReturnType<typeof setTimeout>>(null);

  const q = searchParams.get("q") ?? "";
  const categoryId = searchParams.get("categoryId") ?? "";
  const sort = searchParams.get("sort") ?? "stock";

  const pushParams = (updates: Record<string, string>) => {
    const merged = { q, categoryId, sort, ...updates };
    const params = new URLSearchParams();
    if (merged.q) params.set("q", merged.q);
    if (merged.categoryId) params.set("categoryId", merged.categoryId);
    if (merged.sort && merged.sort !== "stock") params.set("sort", merged.sort);
    const qs = params.toString();
    router.push(`/consumable/list${qs ? `?${qs}` : ""}`);
  };

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
        <SearchInput
          placeholder="消耗品を検索..."
          defaultValue={q}
          onChange={(e) => {
            clearTimeout(searchTimeout.current ?? undefined);
            const val = e.target.value;
            searchTimeout.current = setTimeout(() => pushParams({ q: val }), 400);
          }}
        />
      </div>
      <div className="flex gap-2">
        <Select
          options={categoryOptions}
          className="w-40"
          value={categoryId}
          onChange={(e) => pushParams({ categoryId: e.target.value })}
        />
        <Select
          options={sortOptions}
          className="w-32"
          value={sort}
          onChange={(e) => pushParams({ sort: e.target.value })}
        />
      </div>
    </div>
  );
}
