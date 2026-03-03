-- DropTable
DROP TABLE "CleaningTask";

-- DropEnum
DROP TYPE "Frequency";

-- CreateTable
CREATE TABLE "CleaningItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "frequency" INTEGER NOT NULL,
    "lastCleanedAt" DATE NOT NULL,
    "nextCleaningAt" DATE NOT NULL,
    "description" TEXT,
    "memo" TEXT,
    "imageFileName" TEXT,
    "warningStatus" TEXT NOT NULL DEFAULT 'none',
    "categoryIds" TEXT[],
    "consumableIds" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CleaningItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KaizenRecord" (
    "id" TEXT NOT NULL,
    "cleaningItemId" TEXT NOT NULL,
    "cause" TEXT NOT NULL,
    "previousFrequency" INTEGER NOT NULL,
    "newFrequency" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KaizenRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WarningTask" (
    "id" TEXT NOT NULL,
    "cleaningItemId" TEXT NOT NULL,
    "kaizenRecordId" TEXT NOT NULL,
    "consecutiveOnTimeCount" INTEGER NOT NULL DEFAULT 0,
    "startedAt" DATE NOT NULL,
    "resolvedAt" DATE,

    CONSTRAINT "WarningTask_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WarningTask_cleaningItemId_key" ON "WarningTask"("cleaningItemId");

-- AddForeignKey
ALTER TABLE "KaizenRecord" ADD CONSTRAINT "KaizenRecord_cleaningItemId_fkey" FOREIGN KEY ("cleaningItemId") REFERENCES "CleaningItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarningTask" ADD CONSTRAINT "WarningTask_cleaningItemId_fkey" FOREIGN KEY ("cleaningItemId") REFERENCES "CleaningItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
