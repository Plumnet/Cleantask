"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ConsumableItem, StockOutRecord } from "@/types/consumable";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Counter } from "@/components/ui/Counter";
import { StockOutHistory } from "@/components/consumable/StockOutHistory";
import { mockConsumableCategories } from "@/data/mockCategories";
import { createClient } from "@/lib/supabase/client";

type Props = {
  item: ConsumableItem;
  stockOutRecords: StockOutRecord[];
};

export function ConsumableDetailContent({ item, stockOutRecords }: Props) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const category = mockConsumableCategories.find(
    (c) => c.id === item.categoryId,
  );

  useEffect(() => {
    if (!item.imageFileName) return;
    const supabase = createClient();
    supabase.storage
      .from("cleaning")
      .createSignedUrl(item.imageFileName, 3600)
      .then(({ data }) => {
        if (data?.signedUrl) setImageUrl(data.signedUrl);
      });
  }, [item.imageFileName]);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">消耗品詳細</h1>
        <div className="flex gap-2">
          <Link href={`/consumable/${item.id}/edit`}>
            <Button variant="secondary">編集</Button>
          </Link>
          <Link href="/consumable/list">
            <Button variant="ghost">戻る</Button>
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        <Card>
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-semibold text-gray-900">
                {item.name}
              </h2>
              {category && (
                <Badge className={category.color}>{category.name}</Badge>
              )}
              {item.currentStock === 0 && (
                <Badge className="bg-red-100 text-red-800">在庫切れ</Badge>
              )}
              {item.currentStock > 0 &&
                item.currentStock / item.maxStock <= 0.3 && (
                  <Badge className="bg-orange-100 text-orange-800">残り少</Badge>
                )}
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">残量</p>
              <Counter current={item.currentStock} max={item.maxStock} />
            </div>

            <div className="pt-2 border-t border-gray-100 space-y-3">
              <div>
                <p className="text-sm text-gray-600">カテゴリー</p>
                <div className="mt-1">
                  {category ? (
                    <Badge className={category.color}>{category.name}</Badge>
                  ) : (
                    <span className="text-sm text-gray-400">未設定</span>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600">購入先</p>
                <p className="text-sm text-gray-900 mt-1">{item.shopType}</p>
                {item.shopType === "ネットショップ" && item.keyword && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    検索キーワード: {item.keyword}
                  </p>
                )}
              </div>
            </div>

            {imageUrl && (
              <div className="pt-2 border-t border-gray-100">
                <p className="text-sm text-gray-600 mb-2">画像</p>
                <Image
                  src={imageUrl}
                  alt={item.name}
                  width={300}
                  height={300}
                  className="rounded-md border border-gray-200 object-cover"
                />
              </div>
            )}

            {item.memo && (
              <div className="pt-2 border-t border-gray-100">
                <p className="text-sm text-gray-600">メモ</p>
                <p className="text-gray-900 mt-1 text-sm">{item.memo}</p>
              </div>
            )}
          </div>
        </Card>

        <StockOutHistory records={stockOutRecords} />
      </div>

      <div className="mt-6">
        <Link
          href="/consumable/list"
          className="text-blue-600 hover:underline text-sm"
        >
          ← 一覧に戻る
        </Link>
      </div>

    </>
  );
}
