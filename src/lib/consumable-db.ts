import type { ConsumableItem as PrismaConsumableItem, StockOutRecord as PrismaStockOutRecord } from "@prisma/client";
import type { ConsumableItem, StockOutRecord } from "@/types/consumable";

export function toConsumableItem(p: PrismaConsumableItem): ConsumableItem {
  return {
    id: p.id,
    name: p.name,
    categoryId: p.categoryId,
    maxStock: p.maxStock,
    currentStock: p.currentStock,
    memo: p.memo ?? undefined,
    shopType: p.shopType as "ネットショップ" | "実店舗",
    keyword: p.keyword ?? undefined,
    imageFileName: p.imageFileName ?? undefined,
  };
}

export function toStockOutRecord(p: PrismaStockOutRecord): StockOutRecord {
  return {
    id: p.id,
    consumableId: p.consumableId,
    date: p.date.toISOString().split("T")[0],
    note: p.note ?? undefined,
  };
}
