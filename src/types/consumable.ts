export type ConsumableItem = {
  id: string;
  name: string;
  categoryId: string;
  maxStock: number; // 最大ストック数
  currentStock: number; // 現在の残り量
  memo?: string;
};

export type StockOutRecord = {
  id: string;
  consumableId: string;
  date: string; // ISO日付
  note?: string;
};
