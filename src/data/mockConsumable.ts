import type { ConsumableItem, StockOutRecord } from "@/types/consumable";

export const mockConsumableItems: ConsumableItem[] = [
  {
    id: "cons-1",
    name: "トイレットペーパー",
    categoryId: "ccat-2",
    maxStock: 5,
    currentStock: 2,
    memo: "12ロール入りパック",
  },
  {
    id: "cons-2",
    name: "食器用洗剤",
    categoryId: "ccat-1",
    maxStock: 3,
    currentStock: 1,
    memo: "詰め替え用",
  },
  {
    id: "cons-3",
    name: "ラップ",
    categoryId: "ccat-3",
    maxStock: 3,
    currentStock: 3,
  },
  {
    id: "cons-4",
    name: "ティッシュペーパー",
    categoryId: "ccat-2",
    maxStock: 5,
    currentStock: 4,
    memo: "5箱セット",
  },
  {
    id: "cons-5",
    name: "洗濯洗剤",
    categoryId: "ccat-1",
    maxStock: 3,
    currentStock: 0,
    memo: "液体タイプ",
  },
  {
    id: "cons-6",
    name: "ゴミ袋（45L）",
    categoryId: "ccat-4",
    maxStock: 4,
    currentStock: 2,
  },
];

export const mockStockOutRecords: StockOutRecord[] = [
  {
    id: "record-1",
    consumableId: "cons-1",
    date: "2024-01-10",
    note: "急いで買いに行った",
  },
  {
    id: "record-2",
    consumableId: "cons-1",
    date: "2023-12-15",
  },
  {
    id: "record-3",
    consumableId: "cons-2",
    date: "2024-01-05",
  },
  {
    id: "record-4",
    consumableId: "cons-5",
    date: "2024-01-14",
    note: "在庫切れ中",
  },
];
