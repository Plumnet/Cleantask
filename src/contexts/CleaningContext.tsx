"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import type { CleaningItem, KaizenRecord } from "@/types/cleaning";
import type { Category } from "@/types/category";
import { mockCleaningItems } from "@/data/mockCleaning";
import { mockCategories } from "@/data/mockCategories";

const toISO = (d: Date) => d.toISOString().split("T")[0];

function addDaysToDate(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return toISO(d);
}

type CleaningContextValue = {
  items: CleaningItem[];
  categories: Category[];
  addItem: (
    item: Omit<
      CleaningItem,
      "id" | "warningStatus" | "kaizenHistory" | "nextCleaningAt"
    >,
  ) => void;
  updateItem: (id: string, updates: Partial<CleaningItem>) => void;
  deleteItem: (id: string) => void;
  completeTask: (id: string) => void;
  submitKaizen: (
    itemId: string,
    cause: string,
    newFrequency?: number,
  ) => void;
  cancelWarning: (itemId: string) => void;
  addCategory: (name: string) => Category | null;

  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategoryId: string;
  setSelectedCategoryId: (id: string) => void;
  sortKey: string;
  setSortKey: (key: string) => void;

  filteredNormalItems: CleaningItem[];
  warningItems: CleaningItem[];
  overdueItems: CleaningItem[];

  kaizenTargetId: string | null;
  setKaizenTargetId: (id: string | null) => void;
  overdueAlertShown: boolean;
  setOverdueAlertShown: (v: boolean) => void;
};

const CleaningContext = createContext<CleaningContextValue | null>(null);

export function useCleaningContext() {
  const ctx = useContext(CleaningContext);
  if (!ctx) {
    throw new Error(
      "useCleaningContext must be used within a CleaningProvider",
    );
  }
  return ctx;
}

const CATEGORY_COLORS = [
  "bg-blue-100 text-blue-800",
  "bg-green-100 text-green-800",
  "bg-cyan-100 text-cyan-800",
  "bg-purple-100 text-purple-800",
  "bg-pink-100 text-pink-800",
  "bg-yellow-100 text-yellow-800",
  "bg-orange-100 text-orange-800",
  "bg-red-100 text-red-800",
  "bg-indigo-100 text-indigo-800",
  "bg-teal-100 text-teal-800",
];

export function CleaningProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CleaningItem[]>(mockCleaningItems);
  const [categories, setCategories] = useState<Category[]>([
    ...mockCategories,
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [sortKey, setSortKey] = useState("nextAsc");

  const [kaizenTargetId, setKaizenTargetId] = useState<string | null>(null);
  const [overdueAlertShown, setOverdueAlertShown] = useState(false);

  const addItem = useCallback(
    (
      item: Omit<
        CleaningItem,
        "id" | "warningStatus" | "kaizenHistory" | "nextCleaningAt"
      >,
    ) => {
      const newItem: CleaningItem = {
        ...item,
        id: `clean-${Date.now()}`,
        warningStatus: "none",
        kaizenHistory: [],
        nextCleaningAt: addDaysToDate(item.lastCleanedAt, item.frequency),
      };
      setItems((prev) => [...prev, newItem]);
    },
    [],
  );

  const updateItem = useCallback(
    (id: string, updates: Partial<CleaningItem>) => {
      setItems((prev) =>
        prev.map((item) => {
          if (item.id !== id) return item;
          const updated = { ...item, ...updates };
          if (updates.lastCleanedAt || updates.frequency) {
            updated.nextCleaningAt = addDaysToDate(
              updated.lastCleanedAt,
              updated.frequency,
            );
          }
          return updated;
        }),
      );
    },
    [],
  );

  const deleteItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const completeTask = useCallback((id: string) => {
    const todayStr = toISO(new Date());
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const updated: CleaningItem = {
          ...item,
          lastCleanedAt: todayStr,
          nextCleaningAt: addDaysToDate(todayStr, item.frequency),
        };

        if (item.warningStatus === "warning" && item.warningTask) {
          const isOnTime = todayStr <= item.nextCleaningAt;
          const newCount = isOnTime
            ? item.warningTask.consecutiveOnTimeCount + 1
            : 0;

          if (newCount >= 3) {
            updated.warningStatus = "none";
            updated.warningTask = {
              ...item.warningTask,
              consecutiveOnTimeCount: 3,
              resolvedAt: todayStr,
            };
          } else {
            updated.warningTask = {
              ...item.warningTask,
              consecutiveOnTimeCount: newCount,
            };
          }
        }

        return updated;
      }),
    );
  }, []);

  const submitKaizen = useCallback(
    (itemId: string, cause: string, newFrequency?: number) => {
      const todayStr = toISO(new Date());
      setItems((prev) =>
        prev.map((item) => {
          if (item.id !== itemId) return item;

          const kaizenRecord: KaizenRecord = {
            id: `kaizen-${Date.now()}`,
            cleaningItemId: itemId,
            cause,
            previousFrequency: item.frequency,
            newFrequency: newFrequency ?? item.frequency,
            createdAt: todayStr,
          };

          const updatedFrequency = newFrequency ?? item.frequency;

          return {
            ...item,
            frequency: updatedFrequency,
            nextCleaningAt: addDaysToDate(todayStr, updatedFrequency),
            lastCleanedAt: todayStr,
            warningStatus: "warning" as const,
            kaizenHistory: [...item.kaizenHistory, kaizenRecord].slice(-30),
            warningTask: {
              cleaningItemId: itemId,
              kaizenRecordId: kaizenRecord.id,
              consecutiveOnTimeCount: 0,
              startedAt: todayStr,
            },
          };
        }),
      );
    },
    [],
  );

  const cancelWarning = useCallback((itemId: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        return {
          ...item,
          warningStatus: "none" as const,
          warningTask: item.warningTask
            ? { ...item.warningTask, resolvedAt: toISO(new Date()) }
            : undefined,
        };
      }),
    );
  }, []);

  const addCategory = useCallback(
    (name: string): Category | null => {
      const trimmed = name.trim();
      if (!trimmed) return null;
      if (categories.some((c) => c.name === trimmed)) return null;

      const colorIndex = categories.length % CATEGORY_COLORS.length;
      const newCat: Category = {
        id: `cat-${Date.now()}`,
        name: trimmed,
        color: CATEGORY_COLORS[colorIndex],
      };
      setCategories((prev) => [...prev, newCat]);
      return newCat;
    },
    [categories],
  );

  const warningItems = useMemo(
    () => items.filter((i) => i.warningStatus === "warning"),
    [items],
  );

  const overdueItems = useMemo(() => {
    const todayStr = toISO(new Date());
    return items.filter(
      (i) => i.warningStatus === "none" && i.nextCleaningAt < todayStr,
    );
  }, [items]);

  const filteredNormalItems = useMemo(() => {
    let result = items.filter((i) => i.warningStatus !== "warning");

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.memo?.toLowerCase().includes(q) ||
          i.description?.toLowerCase().includes(q),
      );
    }

    if (selectedCategoryId) {
      result = result.filter((i) =>
        i.categoryIds.includes(selectedCategoryId),
      );
    }

    result.sort((a, b) => {
      switch (sortKey) {
        case "nextAsc":
          return a.nextCleaningAt.localeCompare(b.nextCleaningAt);
        case "nextDesc":
          return b.nextCleaningAt.localeCompare(a.nextCleaningAt);
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return a.nextCleaningAt.localeCompare(b.nextCleaningAt);
      }
    });

    return result;
  }, [items, searchQuery, selectedCategoryId, sortKey]);

  const value = useMemo<CleaningContextValue>(
    () => ({
      items,
      categories,
      addItem,
      updateItem,
      deleteItem,
      completeTask,
      submitKaizen,
      cancelWarning,
      addCategory,
      searchQuery,
      setSearchQuery,
      selectedCategoryId,
      setSelectedCategoryId,
      sortKey,
      setSortKey,
      filteredNormalItems,
      warningItems,
      overdueItems,
      kaizenTargetId,
      setKaizenTargetId,
      overdueAlertShown,
      setOverdueAlertShown,
    }),
    [
      items,
      categories,
      addItem,
      updateItem,
      deleteItem,
      completeTask,
      submitKaizen,
      cancelWarning,
      addCategory,
      searchQuery,
      selectedCategoryId,
      sortKey,
      filteredNormalItems,
      warningItems,
      overdueItems,
      kaizenTargetId,
      overdueAlertShown,
    ],
  );

  return (
    <CleaningContext.Provider value={value}>{children}</CleaningContext.Provider>
  );
}
