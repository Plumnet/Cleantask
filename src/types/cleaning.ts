export type KaizenRecord = {
  id: string;
  cleaningItemId: string;
  cause: string;
  previousFrequency: number;
  newFrequency: number;
  createdAt: string;
};

export type WarningTask = {
  cleaningItemId: string;
  kaizenRecordId: string;
  consecutiveOnTimeCount: number; // 0-3
  startedAt: string;
  resolvedAt?: string;
};

export type CleaningItem = {
  id: string;
  name: string;
  categoryIds: string[];
  consumableIds: string[];
  frequency: number; // 1-365日
  lastCleanedAt: string; // ISO日付
  nextCleaningAt: string; // ISO日付
  description?: string;
  memo?: string;
  imageFileName?: string;
  warningStatus: "none" | "warning";
  kaizenHistory: KaizenRecord[];
  warningTask?: WarningTask;
};
