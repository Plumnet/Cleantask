"use client";

import Link from "next/link";
import type { ConsumableItem } from "@/types/consumable";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { mockConsumableCategories } from "@/data/mockCategories";

type ConsumableFormProps = {
  item?: ConsumableItem;
  isEdit?: boolean;
};

export function ConsumableForm({ item, isEdit = false }: ConsumableFormProps) {
  const categoryOptions = mockConsumableCategories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));

  return (
    <Card>
      <form className="space-y-4">
        <Input
          label="消耗品名"
          type="text"
          placeholder="例: トイレットペーパー"
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
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="最大ストック数"
            type="number"
            placeholder="例: 5"
            min={1}
            defaultValue={item?.maxStock}
            required
          />
          <Input
            label="現在の残量"
            type="number"
            placeholder="例: 2"
            min={0}
            defaultValue={item?.currentStock}
            required
          />
        </div>
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
          <Link href="/consumable/list">
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
