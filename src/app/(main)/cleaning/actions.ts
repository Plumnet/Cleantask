"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { CleaningItem } from "@/types/cleaning";
import { toISO, addDaysToDate } from "@/lib/cleaning-db";

export async function createCleaningItem(
  data: Omit<
    CleaningItem,
    "id" | "warningStatus" | "kaizenHistory" | "nextCleaningAt"
  >,
): Promise<void> {
  const nextCleaningAt = addDaysToDate(data.lastCleanedAt, data.frequency);
  await prisma.cleaningItem.create({
    data: {
      name: data.name,
      categoryIds: data.categoryIds,
      consumableIds: data.consumableIds,
      frequency: data.frequency,
      lastCleanedAt: new Date(data.lastCleanedAt),
      nextCleaningAt,
      description: data.description ?? null,
      memo: data.memo ?? null,
      imageFileName: data.imageFileName ?? null,
    },
  });
  revalidatePath("/cleaning/list");
}

export async function updateCleaningItem(
  id: string,
  data: Partial<
    Omit<CleaningItem, "id" | "warningStatus" | "kaizenHistory" | "warningTask">
  >,
): Promise<void> {
  const updateData: Record<string, unknown> = {};

  if (data.name !== undefined) updateData.name = data.name;
  if (data.categoryIds !== undefined) updateData.categoryIds = data.categoryIds;
  if (data.consumableIds !== undefined)
    updateData.consumableIds = data.consumableIds;
  if (data.frequency !== undefined) updateData.frequency = data.frequency;
  if (data.description !== undefined)
    updateData.description = data.description ?? null;
  if (data.memo !== undefined) updateData.memo = data.memo ?? null;
  if (data.imageFileName !== undefined)
    updateData.imageFileName = data.imageFileName ?? null;

  if (data.lastCleanedAt !== undefined) {
    updateData.lastCleanedAt = new Date(data.lastCleanedAt);
    const freq = data.frequency;
    if (freq !== undefined) {
      updateData.nextCleaningAt = addDaysToDate(data.lastCleanedAt, freq);
    } else {
      const current = await prisma.cleaningItem.findUnique({ where: { id } });
      if (current) {
        updateData.nextCleaningAt = addDaysToDate(
          toISO(current.lastCleanedAt),
          current.frequency,
        );
      }
    }
  } else if (data.frequency !== undefined) {
    const current = await prisma.cleaningItem.findUnique({ where: { id } });
    if (current) {
      updateData.nextCleaningAt = addDaysToDate(
        toISO(current.lastCleanedAt),
        data.frequency,
      );
    }
  }

  await prisma.cleaningItem.update({ where: { id }, data: updateData });
  revalidatePath("/cleaning/list");
}

export async function deleteCleaningItem(id: string): Promise<void> {
  await prisma.cleaningItem.delete({ where: { id } });
  revalidatePath("/cleaning/list");
}

export async function completeCleaningTask(id: string): Promise<void> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const item = await prisma.cleaningItem.findUnique({
    where: { id },
    include: { warningTask: true },
  });
  if (!item) return;

  const todayStr = toISO(today);
  const nextCleaningAt = addDaysToDate(todayStr, item.frequency);

  const updateData: Record<string, unknown> = {
    lastCleanedAt: today,
    nextCleaningAt,
  };

  if (item.warningTask) {
    const isOnTime = todayStr <= toISO(item.nextCleaningAt);
    const newCount = isOnTime
      ? item.warningTask.consecutiveOnTimeCount + 1
      : 0;

    if (newCount >= 3) {
      updateData.warningStatus = "none";
      await prisma.warningTask.update({
        where: { cleaningItemId: id },
        data: { consecutiveOnTimeCount: 3, resolvedAt: today },
      });
    } else {
      await prisma.warningTask.update({
        where: { cleaningItemId: id },
        data: { consecutiveOnTimeCount: newCount },
      });
    }
  }

  await prisma.cleaningItem.update({ where: { id }, data: updateData });

  // リンクされた消耗品の残量を減らす
  for (const consumableId of item.consumableIds) {
    const cons = await prisma.consumableItem.findUnique({
      where: { id: consumableId },
    });
    if (!cons || cons.currentStock <= 0) continue;

    const updated = await prisma.consumableItem.update({
      where: { id: consumableId },
      data: { currentStock: { decrement: 1 } },
    });

    if (updated.currentStock === 0) {
      await prisma.stockOutRecord.create({
        data: { consumableId, date: today },
      });
    }
  }

  revalidatePath("/cleaning/list");
}

export async function submitKaizen(
  itemId: string,
  cause: string,
  newFrequency?: number,
): Promise<void> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = toISO(today);

  const item = await prisma.cleaningItem.findUnique({ where: { id: itemId } });
  if (!item) return;

  const updatedFrequency = newFrequency ?? item.frequency;
  const nextCleaningAt = addDaysToDate(todayStr, updatedFrequency);

  const kaizenRecord = await prisma.kaizenRecord.create({
    data: {
      cleaningItemId: itemId,
      cause,
      previousFrequency: item.frequency,
      newFrequency: updatedFrequency,
      createdAt: today,
    },
  });

  await prisma.warningTask.deleteMany({ where: { cleaningItemId: itemId } });
  await prisma.warningTask.create({
    data: {
      cleaningItemId: itemId,
      kaizenRecordId: kaizenRecord.id,
      consecutiveOnTimeCount: 0,
      startedAt: today,
    },
  });

  await prisma.cleaningItem.update({
    where: { id: itemId },
    data: {
      frequency: updatedFrequency,
      lastCleanedAt: today,
      nextCleaningAt,
      warningStatus: "warning",
    },
  });

  revalidatePath("/cleaning/list");
}

export async function cancelWarning(itemId: string): Promise<void> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await prisma.warningTask.updateMany({
    where: { cleaningItemId: itemId },
    data: { resolvedAt: today },
  });

  await prisma.cleaningItem.update({
    where: { id: itemId },
    data: { warningStatus: "none" },
  });

  revalidatePath("/cleaning/list");
}
