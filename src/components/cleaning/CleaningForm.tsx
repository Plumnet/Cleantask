"use client";

import Link from "next/link";
import type { CleaningItem } from "@/types/cleaning";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { mockCategories } from "@/data/mockCategories";

type CleaningFormProps = {
  item?: CleaningItem;
  isEdit?: boolean;
};

export function CleaningForm({ item, isEdit = false }: CleaningFormProps) {
  const categoryOptions = mockCategories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));

  return (
    <Card>
      <form className="space-y-4">
        <Input
          label="タスク名"
          type="text"
          placeholder="例: 床掃除"
          defaultValue={item?.name}
          required
        />
        <Select
          label="カテゴリー"
          options={categoryOptions}
          placeholder="カテゴリーを選択"
          defaultValue={item?.categoryId}
          required
        />
        <Input
          label="掃除頻度（日数）"
          type="number"
          placeholder="例: 7"
          min={1}
          defaultValue={item?.frequency}
          required
        />
        <Input
          label="最終掃除日"
          type="date"
          defaultValue={item?.lastCleanedAt}
          required
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            メモ
          </label>
          <textarea
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            rows={3}
            placeholder="任意のメモを入力"
            defaultValue={item?.memo}
          />
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <Link href="/cleaning/list">
            <Button type="button" variant="secondary">
              キャンセル
            </Button>
          </Link>
          <Button type="submit">{isEdit ? "更新する" : "登録する"}</Button>
        </div>
      </form>
    </Card>
  );
}
