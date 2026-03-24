"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { CleaningItem } from "@/types/cleaning";
import { toISO, addDays as addDaysToDate } from "@/lib/date-utils";
import { getCurrentUserId } from "@/lib/auth";

export async function createCleaningItem(
  data: Omit<
    CleaningItem,
    "id" | "warningStatus" | "kaizenHistory" | "nextCleaningAt"
  >,
): Promise<void> {
  const userId = await getCurrentUserId();
  const nextCleaningAt = addDaysToDate(data.lastCleanedAt, data.frequency);
  await prisma.cleaningItem.create({
    data: {
      userId,
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
  const userId = await getCurrentUserId();
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
      const current = await prisma.cleaningItem.findFirst({ where: { id, OR: [{ userId }, { userId: "" }] } });
      if (current) {
        updateData.nextCleaningAt = addDaysToDate(
          toISO(current.lastCleanedAt),
          current.frequency,
        );
      }
    }
  } else if (data.frequency !== undefined) {
    const current = await prisma.cleaningItem.findFirst({ where: { id, OR: [{ userId }, { userId: "" }] } });
    if (current) {
      updateData.nextCleaningAt = addDaysToDate(
        toISO(current.lastCleanedAt),
        data.frequency,
      );
    }
  }

  await prisma.cleaningItem.updateMany({ where: { id, OR: [{ userId }, { userId: "" }] }, data: { ...updateData, userId } });
  revalidatePath("/cleaning/list");
}

export async function deleteCleaningItem(id: string): Promise<void> {
  const userId = await getCurrentUserId();
  await prisma.cleaningItem.deleteMany({ where: { id, OR: [{ userId }, { userId: "" }] } });
  revalidatePath("/cleaning/list");
}

export async function completeCleaningTask(id: string): Promise<void> {
  const userId = await getCurrentUserId();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const item = await prisma.cleaningItem.findFirst({
    where: { id, OR: [{ userId }, { userId: "" }] },
    include: { warningTask: true },
  });
  if (!item) return;

  // userId 未設定の古いデータは現在のユーザーに帰属させる
  if (item.userId === "") {
    await prisma.cleaningItem.update({ where: { id }, data: { userId } });
  }

  const todayStr = toISO(today);

  // 警戒タスクは「期限内完了なら次回日付を基点に加算」「期限超過なら今日を基点に加算」
  const isOnTime = item.warningTask
    ? todayStr <= toISO(item.nextCleaningAt)
    : false;
  const baseDate = item.warningTask && isOnTime
    ? toISO(item.nextCleaningAt)
    : todayStr;
  const nextCleaningAt = addDaysToDate(baseDate, item.frequency);

  const updateData: Record<string, unknown> = {
    lastCleanedAt: today,
    nextCleaningAt,
  };

  if (item.warningTask) {
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
    const cons = await prisma.consumableItem.findFirst({
      where: { id: consumableId, userId },
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
  const userId = await getCurrentUserId();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = toISO(today);

  const item = await prisma.cleaningItem.findFirst({ where: { id: itemId, OR: [{ userId }, { userId: "" }] } });
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
  const userId = await getCurrentUserId();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const item = await prisma.cleaningItem.findFirst({ where: { id: itemId, OR: [{ userId }, { userId: "" }] } });
  if (!item) return;

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
