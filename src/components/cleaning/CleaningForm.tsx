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
import { ImageUploadField } from "@/components/ui/ImageUploadField";
import { useCleaningContext } from "@/contexts/CleaningContext";
import { CategoryCreateModal } from "@/components/cleaning/CategoryCreateModal";
import { mockConsumableItems } from "@/data/mockConsumable";
import { useImageUpload } from "@/hooks/useImageUpload";
import {
  MAX_CATEGORIES_PER_TASK,
  MAX_CONSUMABLES_PER_TASK,
  FREQUENCY_MIN,
  FREQUENCY_MAX,
} from "@/lib/constants";

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

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  const imageUpload = useImageUpload({
    bucket: "cleaning",
    pathPrefix: "cleaning",
    existingFileName: item?.imageFileName,
  });

  const categoryOptions = categories
    .filter((c) => !categoryIds.includes(c.id))
    .map((c) => ({ value: c.id, label: c.name }));

  const consumableOptions = mockConsumableItems
    .filter((c) => !consumableIds.includes(c.id))
    .map((c) => ({ value: c.id, label: c.name }));

  const handleAddCategory = (catId: string) => {
    if (!catId || categoryIds.length >= MAX_CATEGORIES_PER_TASK) return;
    setCategoryIds((prev) => [...prev, catId]);
  };

  const handleRemoveCategory = (catId: string) => {
    setCategoryIds((prev) => prev.filter((id) => id !== catId));
  };

  const handleAddConsumable = (consId: string) => {
    if (!consId || consumableIds.length >= MAX_CONSUMABLES_PER_TASK) return;
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
    if (frequency < FREQUENCY_MIN || frequency > FREQUENCY_MAX)
      newErrors.frequency = `${FREQUENCY_MIN}〜${FREQUENCY_MAX}日の範囲で入力してください`;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
      imageFileName: imageUpload.imageFileName || undefined,
    };

    if (isEdit && item) {
      await updateItem(item.id, data);
    } else {
      await addItem({
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
            {categoryIds.length < MAX_CATEGORIES_PER_TASK && (
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
              {categoryIds.length}/{MAX_CATEGORIES_PER_TASK} 選択済み
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
            {consumableIds.length < MAX_CONSUMABLES_PER_TASK && (
              <Select
                options={consumableOptions}
                placeholder="消耗品を選択"
                onChange={(e) => handleAddConsumable(e.target.value)}
                value=""
              />
            )}
            <p className="text-xs text-gray-500 mt-1">
              {consumableIds.length}/{MAX_CONSUMABLES_PER_TASK} 選択済み
            </p>
          </div>

          {/* 画像アップロード */}
          <ImageUploadField
            fileInputRef={imageUpload.fileInputRef}
            isUploading={imageUpload.isUploading}
            uploadError={imageUpload.uploadError}
            imagePreviewUrl={imageUpload.imagePreviewUrl}
            imageFileName={imageUpload.imageFileName}
            onFileChange={imageUpload.handleFileChange}
            onClear={imageUpload.clearImage}
          />

          <Input
            label="掃除頻度（日数）"
            type="number"
            placeholder="例: 7"
            min={FREQUENCY_MIN}
            max={FREQUENCY_MAX}
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
