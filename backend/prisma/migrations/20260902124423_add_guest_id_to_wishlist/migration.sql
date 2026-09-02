-- DropForeignKey
ALTER TABLE "WishlistItem" DROP CONSTRAINT "WishlistItem_userId_fkey";

-- DropIndex
DROP INDEX "WishlistItem_userId_productId_key";

-- AlterTable
ALTER TABLE "WishlistItem" ADD COLUMN     "guestId" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "WishlistItem_guestId_idx" ON "WishlistItem"("guestId");

-- AddForeignKey
ALTER TABLE "WishlistItem" ADD CONSTRAINT "WishlistItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
