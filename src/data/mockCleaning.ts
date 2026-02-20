import type { CleaningItem } from "@/types/cleaning";

const today = new Date();
const toISO = (d: Date) => d.toISOString().split("T")[0];
const addDays = (d: Date, n: number) => {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
};

export const mockCleaningItems: CleaningItem[] = [
  {
    id: "clean-1",
    name: "床掃除",
    categoryIds: ["cat-1"],
    consumableIds: [],
    frequency: 3,
    lastCleanedAt: toISO(addDays(today, -2)),
    nextCleaningAt: toISO(addDays(today, 1)),
    memo: "掃除機とモップ",
    warningStatus: "none",
    kaizenHistory: [],
  },
  {
    id: "clean-2",
    name: "換気扇",
    categoryIds: ["cat-2"],
    consumableIds: [],
    frequency: 30,
    lastCleanedAt: toISO(addDays(today, -28)),
    nextCleaningAt: toISO(addDays(today, 2)),
    memo: "月1回の大掃除",
    warningStatus: "none",
    kaizenHistory: [],
  },
  {
    id: "clean-3",
    name: "浴槽",
    categoryIds: ["cat-3"],
    consumableIds: ["cons-1"],
    frequency: 1,
    lastCleanedAt: toISO(addDays(today, -1)),
    nextCleaningAt: toISO(today),
    warningStatus: "none",
    kaizenHistory: [],
  },
  {
    id: "clean-4",
    name: "トイレ掃除",
    categoryIds: ["cat-4"],
    consumableIds: ["cons-2"],
    frequency: 2,
    lastCleanedAt: toISO(addDays(today, -4)),
    nextCleaningAt: toISO(addDays(today, -2)),
    warningStatus: "none",
    kaizenHistory: [],
  },
  {
    id: "clean-5",
    name: "窓拭き",
    categoryIds: ["cat-1", "cat-5"],
    consumableIds: [],
    frequency: 14,
    lastCleanedAt: toISO(addDays(today, -10)),
    nextCleaningAt: toISO(addDays(today, 4)),
    memo: "リビングの大きな窓",
    warningStatus: "none",
    kaizenHistory: [],
  },
  {
    id: "clean-6",
    name: "エアコンフィルター",
    categoryIds: ["cat-5"],
    consumableIds: [],
    frequency: 14,
    lastCleanedAt: toISO(addDays(today, -20)),
    nextCleaningAt: toISO(addDays(today, -6)),
    warningStatus: "none",
    kaizenHistory: [],
  },
  {
    id: "clean-7",
    name: "洗面台掃除",
    categoryIds: ["cat-6"],
    consumableIds: ["cons-1"],
    frequency: 7,
    lastCleanedAt: toISO(addDays(today, -14)),
    nextCleaningAt: toISO(addDays(today, -7)),
    warningStatus: "warning",
    kaizenHistory: [
      {
        id: "kaizen-1",
        cleaningItemId: "clean-7",
        cause: "忙しくて後回しにしてしまった",
        previousFrequency: 7,
        newFrequency: 7,
        createdAt: toISO(addDays(today, -7)),
      },
    ],
    warningTask: {
      cleaningItemId: "clean-7",
      kaizenRecordId: "kaizen-1",
      consecutiveOnTimeCount: 1,
      startedAt: toISO(addDays(today, -7)),
    },
  },
];
