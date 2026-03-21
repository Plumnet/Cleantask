"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { ConsumableItem } from "@/types/consumable";
import { getCurrentUserId } from "@/lib/auth";

export async function createConsumableItem(
  data: Omit<ConsumableItem, "id">,
): Promise<void> {
  const userId = await getCurrentUserId();
  await prisma.consumableItem.create({
    data: {
      userId,
      name: data.name,
      categoryId: data.categoryId,
      maxStock: data.maxStock,
      currentStock: data.currentStock,
      memo: data.memo ?? null,
      shopType: data.shopType,
      keyword: data.keyword ?? null,
      imageFileName: data.imageFileName ?? null,
    },
  });
  revalidatePath("/consumable/list");
}

export async function updateConsumableItem(
  id: string,
  data: Partial<Omit<ConsumableItem, "id">>,
): Promise<void> {
  const userId = await getCurrentUserId();
  const updateData: Record<string, unknown> = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
  if (data.maxStock !== undefined) updateData.maxStock = data.maxStock;
  if (data.currentStock !== undefined) updateData.currentStock = data.currentStock;
  if (data.memo !== undefined) updateData.memo = data.memo ?? null;
  if (data.shopType !== undefined) updateData.shopType = data.shopType;
  if (data.keyword !== undefined) updateData.keyword = data.keyword ?? null;
  if (data.imageFileName !== undefined) updateData.imageFileName = data.imageFileName ?? null;

  await prisma.consumableItem.updateMany({ where: { id, OR: [{ userId }, { userId: "" }] }, data: { ...updateData, userId } });
  revalidatePath("/consumable/list");
}

export async function deleteConsumableItem(id: string): Promise<void> {
  const userId = await getCurrentUserId();
  await prisma.consumableItem.deleteMany({ where: { id, OR: [{ userId }, { userId: "" }] } });
  revalidatePath("/consumable/list");
}

export async function decreaseStock(
  id: string,
): Promise<{ newStock: number }> {
  const userId = await getCurrentUserId();
  const item = await prisma.consumableItem.findFirst({ where: { id, OR: [{ userId }, { userId: "" }] } });
  if (!item) return { newStock: 0 };

  if (item.currentStock <= 0) return { newStock: 0 };

  const updated = await prisma.consumableItem.update({
    where: { id },
    data: { currentStock: { decrement: 1 } },
  });

  if (updated.currentStock === 0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    await prisma.stockOutRecord.create({
      data: { consumableId: id, date: today },
    });
  }

  revalidatePath("/consumable/list");
  revalidatePath(`/consumable/${id}`);
  return { newStock: updated.currentStock };
}

/**
 * レシート画像を解析して商品名を返す。
 * OCR_MODE=real のとき Google Cloud Vision API を使用。
 * それ以外はモック（2秒待機後に itemName をそのまま返す）。
 */
export async function analyzeReceiptImage(
  _imageBase64: string,
  itemName: string,
): Promise<{ recognizedName: string }> {
  if (process.env.OCR_MODE === "real") {
    // --- 本番: Google Cloud Vision API ---
    // const apiKey = process.env.GOOGLE_CLOUD_VISION_API_KEY;
    // const response = await fetch(
    //   `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
    //   {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       requests: [{
    //         image: { content: _imageBase64.replace(/^data:image\/\w+;base64,/, "") },
    //         features: [{ type: "TEXT_DETECTION" }],
    //       }],
    //     }),
    //   },
    // );
    // const json = await response.json();
    // const text: string = json.responses?.[0]?.fullTextAnnotation?.text ?? "";
    // return { recognizedName: text.trim() };
    throw new Error("OCR_MODE=real ですが Cloud Vision API の実装が未完了です");
  }

  // --- モック ---
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return { recognizedName: itemName };
}

export async function restockConsumable(id: string): Promise<void> {
  const userId = await getCurrentUserId();
  const item = await prisma.consumableItem.findFirst({ where: { id, OR: [{ userId }, { userId: "" }] } });
  if (!item) return;
  if (item.currentStock >= item.maxStock) return;

  await prisma.consumableItem.update({
    where: { id },
    data: { currentStock: item.maxStock },
  });

  revalidatePath("/consumable/list");
  revalidatePath(`/consumable/${id}`);
}
