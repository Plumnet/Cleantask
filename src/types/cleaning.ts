export type CleaningItem = {
  id: string;
  name: string;
  categoryId: string;
  frequency: number; // 掃除頻度（日数）
  lastCleanedAt: string; // ISO日付
  nextCleaningAt: string; // ISO日付
  memo?: string;
};
