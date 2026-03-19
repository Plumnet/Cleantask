"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { ConsumableItem } from "@/types/consumable";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { mockConsumableCategories } from "@/data/mockCategories";
import {
  createConsumableItem,
  updateConsumableItem,
} from "@/app/(main)/consumable/actions";
import { createClient } from "@/lib/supabase/client";

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
  const [imageFileName, setImageFileName] = useState(item?.imageFileName ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");

  // 編集時：既存画像のプレビュー用 signed URL を取得
  useEffect(() => {
    if (!item?.imageFileName) return;
    const supabase = createClient();
    supabase.storage
      .from("cleaning")
      .createSignedUrl(item.imageFileName, 3600)
      .then(({ data }) => {
        if (data?.signedUrl) setImagePreviewUrl(data.signedUrl);
      });
  }, [item?.imageFileName]);

  const categoryOptions = mockConsumableCategories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));

  const shopTypeOptions = [
    { value: "実店舗", label: "実店舗" },
    { value: "ネットショップ", label: "ネットショップ" },
  ];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setUploadError("JPEG / PNG / WebP 形式の画像を選択してください");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("5MB 以下の画像を選択してください");
      return;
    }

    setUploadError("");
    setIsUploading(true);
    setImagePreviewUrl(URL.createObjectURL(file));

    const ext = file.name.split(".").pop();
    const path = `consumable/${Date.now()}.${ext}`;

    const supabase = createClient();
    const { error } = await supabase.storage.from("cleaning").upload(path, file);

    if (error) {
      setUploadError("アップロードに失敗しました: " + error.message);
      setImagePreviewUrl("");
    } else {
      setImageFileName(path);
    }

    setIsUploading(false);
    e.target.value = "";
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "消耗品名を入力してください";
    if (!categoryId) newErrors.categoryId = "カテゴリーを選択してください";
    if (maxStock < 1 || maxStock > 20) newErrors.maxStock = "1〜20の範囲で入力してください";
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
      imageFileName: imageFileName || undefined,
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
            max={20}
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            画像
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
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
              {isUploading ? "アップロード中..." : "画像を挿入"}
            </Button>
            {imageFileName && !isUploading && (
              <button
                type="button"
                className="text-xs text-red-500 hover:underline"
                onClick={() => {
                  setImageFileName("");
                  setImagePreviewUrl("");
                }}
              >
                削除
              </button>
            )}
          </div>
          {uploadError && (
            <p className="text-sm text-red-500 mt-1">{uploadError}</p>
          )}
          {imagePreviewUrl && (
            <div className="mt-2">
              <img
                src={imagePreviewUrl}
                alt="プレビュー"
                className="w-32 h-32 object-cover rounded-md border border-gray-200"
              />
            </div>
          )}
        </div>

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
