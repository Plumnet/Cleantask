import prisma from "./prisma";
import type { CleaningItem, KaizenRecord, WarningTask } from "@/types/cleaning";
import type {
  CleaningItem as PrismaCleaningItem,
  KaizenRecord as PrismaKaizenRecord,
  WarningTask as PrismaWarningTask,
} from "@prisma/client";
import { toISO } from "@/lib/date-utils";

type PrismaCleaningItemWithRelations = PrismaCleaningItem & {
  kaizenHistory: PrismaKaizenRecord[];
  warningTask: PrismaWarningTask | null;
};

function mapKaizenRecord(k: PrismaKaizenRecord): KaizenRecord {
  return {
    id: k.id,
    cleaningItemId: k.cleaningItemId,
    cause: k.cause,
    previousFrequency: k.previousFrequency,
    newFrequency: k.newFrequency,
    createdAt: toISO(k.createdAt),
  };
}

function mapWarningTask(w: PrismaWarningTask): WarningTask {
  return {
    cleaningItemId: w.cleaningItemId,
    kaizenRecordId: w.kaizenRecordId,
    consecutiveOnTimeCount: w.consecutiveOnTimeCount,
    startedAt: toISO(w.startedAt),
    resolvedAt: w.resolvedAt ? toISO(w.resolvedAt) : undefined,
  };
}

export function mapToCleaningItem(
  record: PrismaCleaningItemWithRelations,
): CleaningItem {
  return {
    id: record.id,
    name: record.name,
    categoryIds: record.categoryIds,
    consumableIds: record.consumableIds,
    frequency: record.frequency,
    lastCleanedAt: toISO(record.lastCleanedAt),
    nextCleaningAt: toISO(record.nextCleaningAt),
    description: record.description ?? undefined,
    memo: record.memo ?? undefined,
    imageFileName: record.imageFileName ?? undefined,
    warningStatus: record.warningStatus as "none" | "warning",
    kaizenHistory: record.kaizenHistory
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      )
      .map(mapKaizenRecord),
    warningTask: record.warningTask
      ? mapWarningTask(record.warningTask)
      : undefined,
  };
}

export async function getCleaningItems(userId: string): Promise<CleaningItem[]> {
  const records = await prisma.cleaningItem.findMany({
    where: { userId },
    include: { kaizenHistory: true, warningTask: true },
    orderBy: { nextCleaningAt: "asc" },
  });
  return records.map(mapToCleaningItem);
}
