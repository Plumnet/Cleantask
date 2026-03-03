import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const today = new Date();
today.setHours(0, 0, 0, 0);

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

async function main() {
  // 既存データを削除してからseed
  await prisma.warningTask.deleteMany();
  await prisma.kaizenRecord.deleteMany();
  await prisma.cleaningItem.deleteMany();

  // clean-1: 床掃除
  await prisma.cleaningItem.create({
    data: {
      id: "clean-1",
      name: "床掃除",
      categoryIds: ["cat-1"],
      consumableIds: [],
      frequency: 3,
      lastCleanedAt: addDays(today, -2),
      nextCleaningAt: addDays(today, 1),
      memo: "掃除機とモップ",
      warningStatus: "none",
    },
  });

  // clean-2: 換気扇
  await prisma.cleaningItem.create({
    data: {
      id: "clean-2",
      name: "換気扇",
      categoryIds: ["cat-2"],
      consumableIds: [],
      frequency: 30,
      lastCleanedAt: addDays(today, -28),
      nextCleaningAt: addDays(today, 2),
      memo: "月1回の大掃除",
      warningStatus: "none",
    },
  });

  // clean-3: 浴槽
  await prisma.cleaningItem.create({
    data: {
      id: "clean-3",
      name: "浴槽",
      categoryIds: ["cat-3"],
      consumableIds: ["cons-1"],
      frequency: 1,
      lastCleanedAt: addDays(today, -1),
      nextCleaningAt: today,
      warningStatus: "none",
    },
  });

  // clean-4: トイレ掃除
  await prisma.cleaningItem.create({
    data: {
      id: "clean-4",
      name: "トイレ掃除",
      categoryIds: ["cat-4"],
      consumableIds: ["cons-2"],
      frequency: 2,
      lastCleanedAt: addDays(today, -4),
      nextCleaningAt: addDays(today, -2),
      warningStatus: "none",
    },
  });

  // clean-5: 窓拭き
  await prisma.cleaningItem.create({
    data: {
      id: "clean-5",
      name: "窓拭き",
      categoryIds: ["cat-1", "cat-5"],
      consumableIds: [],
      frequency: 14,
      lastCleanedAt: addDays(today, -10),
      nextCleaningAt: addDays(today, 4),
      memo: "リビングの大きな窓",
      warningStatus: "none",
    },
  });

  // clean-6: エアコンフィルター
  await prisma.cleaningItem.create({
    data: {
      id: "clean-6",
      name: "エアコンフィルター",
      categoryIds: ["cat-5"],
      consumableIds: [],
      frequency: 14,
      lastCleanedAt: addDays(today, -20),
      nextCleaningAt: addDays(today, -6),
      warningStatus: "none",
    },
  });

  // clean-7: 洗面台掃除（警戒タスク）
  await prisma.cleaningItem.create({
    data: {
      id: "clean-7",
      name: "洗面台掃除",
      categoryIds: ["cat-6"],
      consumableIds: ["cons-1"],
      frequency: 7,
      lastCleanedAt: addDays(today, -14),
      nextCleaningAt: addDays(today, -7),
      warningStatus: "warning",
      kaizenHistory: {
        create: [
          {
            id: "kaizen-1",
            cause: "忙しくて後回しにしてしまった",
            previousFrequency: 7,
            newFrequency: 7,
            createdAt: addDays(today, -7),
          },
        ],
      },
      warningTask: {
        create: {
          kaizenRecordId: "kaizen-1",
          consecutiveOnTimeCount: 1,
          startedAt: addDays(today, -7),
        },
      },
    },
  });

  console.log("✅ Seed完了: 掃除タスク7件を投入しました");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
