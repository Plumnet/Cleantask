-- CreateTable
CREATE TABLE "ConsumableItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "maxStock" INTEGER NOT NULL,
    "currentStock" INTEGER NOT NULL,
    "memo" TEXT,
    "shopType" TEXT NOT NULL DEFAULT '実店舗',
    "keyword" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConsumableItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockOutRecord" (
    "id" TEXT NOT NULL,
    "consumableId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "note" TEXT,

    CONSTRAINT "StockOutRecord_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StockOutRecord" ADD CONSTRAINT "StockOutRecord_consumableId_fkey" FOREIGN KEY ("consumableId") REFERENCES "ConsumableItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
