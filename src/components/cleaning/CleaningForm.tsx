"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { CleaningItem } from "@/types/cleaning";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useCleaningContext } from "@/contexts/CleaningContext";
import { CategoryCreateModal } from "@/components/cleaning/CategoryCreateModal";
import { mockConsumableItems } from "@/data/mockConsumable";

type CleaningFormProps = {
  item?: CleaningItem;
  isEdit?: boolean;
};

export function CleaningForm({ item, isEdit = false }: CleaningFormProps) {
  const router = useRouter();
  const { categories, addItem, updateItem } = useCleaningContext();

  const [name, setName] = useState(item?.name ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [categoryIds, setCategoryIds] = useState<string[]>(
    item?.categoryIds ?? [],
  );
  const [consumableIds, setConsumableIds] = useState<string[]>(
    item?.consumableIds ?? [],
  );
  const [frequency, setFrequency] = useState(item?.frequency ?? 7);
  const [lastCleanedAt, setLastCleanedAt] = useState(
    item?.lastCleanedAt ?? new Date().toISOString().split("T")[0],
  );
  const [memo, setMemo] = useState(item?.memo ?? "");
  const [imageFileName, setImageFileName] = useState(
    item?.imageFileName ?? "",
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  const categoryOptions = categories
    .filter((c) => !categoryIds.includes(c.id))
    .map((c) => ({ value: c.id, label: c.name }));

  const consumableOptions = mockConsumableItems
    .filter((c) => !consumableIds.includes(c.id))
    .map((c) => ({ value: c.id, label: c.name }));

  const handleAddCategory = (catId: string) => {
    if (!catId || categoryIds.length >= 3) return;
    setCategoryIds((prev) => [...prev, catId]);
  };

  const handleRemoveCategory = (catId: string) => {
    setCategoryIds((prev) => prev.filter((id) => id !== catId));
  };

  const handleAddConsumable = (consId: string) => {
    if (!consId || consumableIds.length >= 6) return;
    setConsumableIds((prev) => [...prev, consId]);
  };

  const handleRemoveConsumable = (consId: string) => {
    setConsumableIds((prev) => prev.filter((id) => id !== consId));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "タスク名を入力してください";
    if (categoryIds.length === 0)
      newErrors.category = "カテゴリーを1つ以上選択してください";
    if (frequency < 1 || frequency > 365)
      newErrors.frequency = "1〜365日の範囲で入力してください";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const data = {
      name: name.trim(),
      categoryIds,
      consumableIds,
      frequency,
      lastCleanedAt,
      description: description.trim() || undefined,
      memo: memo.trim() || undefined,
      imageFileName: imageFileName || undefined,
    };

    if (isEdit && item) {
      updateItem(item.id, data);
    } else {
      addItem({
        ...data,
        warningStatus: "none",
        kaizenHistory: [],
      } as Omit<CleaningItem, "id" | "warningStatus" | "kaizenHistory" | "nextCleaningAt">);
    }

    router.push("/cleaning/list");
  };

  return (
    <>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="タスク名"
            type="text"
            placeholder="例: 床掃除"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors((prev) => ({ ...prev, name: "" }));
            }}
            error={errors.name}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              説明
            </label>
            <textarea
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              rows={3}
              placeholder="掃除の詳細や手順を入力"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* カテゴリー選択 (最大3つ) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              カテゴリー <span className="text-red-500">*</span>
            </label>
            {categoryIds.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {categoryIds.map((catId) => {
                  const cat = categories.find((c) => c.id === catId);
                  if (!cat) return null;
                  return (
                    <Badge key={catId} className={cat.color}>
                      {cat.name}
                      <button
                        type="button"
                        className="ml-1 text-current opacity-60 hover:opacity-100"
                        onClick={() => handleRemoveCategory(catId)}
                      >
                        ×
                      </button>
                    </Badge>
                  );
                })}
              </div>
            )}
            {categoryIds.length < 3 && (
              <div className="flex gap-2">
                <Select
                  options={categoryOptions}
                  placeholder="カテゴリーを選択"
                  onChange={(e) => handleAddCategory(e.target.value)}
                  value=""
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setCategoryModalOpen(true)}
                >
                  +
                </Button>
              </div>
            )}
            {errors.category && (
              <p className="text-sm text-red-500 mt-1">{errors.category}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {categoryIds.length}/3 選択済み
            </p>
          </div>

          {/* 使用消耗品選択 (最大6つ) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              使用消耗品
            </label>
            {consumableIds.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {consumableIds.map((consId) => {
                  const cons = mockConsumableItems.find(
                    (c) => c.id === consId,
                  );
                  if (!cons) return null;
                  return (
                    <Badge
                      key={consId}
                      className="bg-gray-100 text-gray-800"
                    >
                      {cons.name}
                      <button
                        type="button"
                        className="ml-1 text-current opacity-60 hover:opacity-100"
                        onClick={() => handleRemoveConsumable(consId)}
                      >
                        ×
                      </button>
                    </Badge>
                  );
                })}
              </div>
            )}
            {consumableIds.length < 6 && (
              <Select
                options={consumableOptions}
                placeholder="消耗品を選択"
                onChange={(e) => handleAddConsumable(e.target.value)}
                value=""
              />
            )}
            <p className="text-xs text-gray-500 mt-1">
              {consumableIds.length}/6 選択済み
            </p>
          </div>

          {/* 画像挿入ボタン (UIのみ) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              画像
            </label>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setImageFileName("image_placeholder.jpg")}
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                画像を挿入
              </Button>
              {imageFileName && (
                <span className="text-sm text-gray-600">{imageFileName}</span>
              )}
            </div>
          </div>

          <Input
            label="掃除頻度（日数）"
            type="number"
            placeholder="例: 7"
            min={1}
            max={365}
            value={frequency}
            onChange={(e) => {
              setFrequency(Number(e.target.value));
              setErrors((prev) => ({ ...prev, frequency: "" }));
            }}
            error={errors.frequency}
            required
          />

          <Input
            label="最終掃除日"
            type="date"
            value={lastCleanedAt}
            onChange={(e) => setLastCleanedAt(e.target.value)}
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
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
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

      <CategoryCreateModal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
      />
    </>
  );
}
