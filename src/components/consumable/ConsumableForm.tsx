"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { ConsumableItem } from "@/types/consumable";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ImageUploadField } from "@/components/ui/ImageUploadField";
import { mockConsumableCategories } from "@/data/mockCategories";
import {
  createConsumableItem,
  updateConsumableItem,
} from "@/app/(main)/consumable/actions";
import { useImageUpload } from "@/hooks/useImageUpload";
import { MAX_STOCK } from "@/lib/constants";

type ConsumableFormProps = {
  item?: ConsumableItem;
  isEdit?: boolean;
};

export function ConsumableForm({ item, isEdit = false }: ConsumableFormProps) {
  const router = useRouter();

  const [name, setName] = useState(item?.name ?? "");
  const [categoryId, setCategoryId] = useState(item?.categoryId ?? "");
  const [maxStock, setMaxStock] = useState(item?.maxStock ?? 1);
  const [currentStock, setCurrentStock] = useState(item?.currentStock ?? 0);
  const [memo, setMemo] = useState(item?.memo ?? "");
  const [shopType, setShopType] = useState<"ネットショップ" | "実店舗">(
    item?.shopType ?? "実店舗",
  );
  const [keyword, setKeyword] = useState(item?.keyword ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const imageUpload = useImageUpload({
    bucket: "cleaning",
    pathPrefix: "consumable",
    existingFileName: item?.imageFileName,
  });

  const categoryOptions = mockConsumableCategories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));

  const shopTypeOptions = [
    { value: "実店舗", label: "実店舗" },
    { value: "ネットショップ", label: "ネットショップ" },
  ];

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "消耗品名を入力してください";
    if (!categoryId) newErrors.categoryId = "カテゴリーを選択してください";
    if (maxStock < 1 || maxStock > MAX_STOCK)
      newErrors.maxStock = `1〜${MAX_STOCK}の範囲で入力してください`;
    if (currentStock < 0 || currentStock > maxStock)
      newErrors.currentStock = `0〜${maxStock}の範囲で入力してください`;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const data: Omit<ConsumableItem, "id"> = {
      name: name.trim(),
      categoryId,
      maxStock,
      currentStock,
      memo: memo.trim() || undefined,
      shopType,
      keyword: shopType === "ネットショップ" ? keyword.trim() || undefined : undefined,
      imageFileName: imageUpload.imageFileName || undefined,
    };

    if (isEdit && item) {
      await updateConsumableItem(item.id, data);
    } else {
      await createConsumableItem(data);
    }

    router.push("/consumable/list");
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="消耗品名"
          type="text"
          placeholder="例: トイレットペーパー"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setErrors((prev) => ({ ...prev, name: "" }));
          }}
          error={errors.name}
          required
        />

        <Select
          label="カテゴリー"
          options={categoryOptions}
          placeholder="カテゴリーを選択"
          value={categoryId}
          onChange={(e) => {
            setCategoryId(e.target.value);
            setErrors((prev) => ({ ...prev, categoryId: "" }));
          }}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="最大ストック数"
            type="number"
            placeholder="例: 5"
            min={1}
            max={MAX_STOCK}
            value={maxStock}
            onChange={(e) => {
              setMaxStock(Number(e.target.value));
              setErrors((prev) => ({ ...prev, maxStock: "" }));
            }}
            error={errors.maxStock}
            required
          />
          <Input
            label="現在の残量"
            type="number"
            placeholder="例: 2"
            min={0}
            max={20}
            value={currentStock}
            onChange={(e) => {
              setCurrentStock(Number(e.target.value));
              setErrors((prev) => ({ ...prev, currentStock: "" }));
            }}
            error={errors.currentStock}
            required
          />
        </div>

        <Select
          label="補充方法"
          options={shopTypeOptions}
          value={shopType}
          onChange={(e) =>
            setShopType(e.target.value as "ネットショップ" | "実店舗")
          }
        />

        {shopType === "ネットショップ" && (
          <Input
            label="検索キーワード（楽天）"
            type="text"
            placeholder="例: トイレットペーパー 12ロール"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        )}

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
