export type ConsumableItem = {
  id: string;
  name: string;
  categoryId: string;
  maxStock: number;
  currentStock: number;
  memo?: string;
  shopType: "ネットショップ" | "実店舗";
  keyword?: string;
  imageFileName?: string;
};

export type StockOutRecord = {
  id: string;
  consumableId: string;
  date: string;
  note?: string;
};
