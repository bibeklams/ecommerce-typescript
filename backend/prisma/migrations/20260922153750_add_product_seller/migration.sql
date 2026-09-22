-- Add sellerId as nullable first
ALTER TABLE "Product"
ADD COLUMN "sellerId" INTEGER;

-- Assign existing products to the approved seller (User ID 8)
UPDATE "Product"
SET "sellerId" = 8
WHERE "sellerId" IS NULL;

-- Now that every existing product has a seller,
-- make the column required
ALTER TABLE "Product"
ALTER COLUMN "sellerId" SET NOT NULL;

-- Add the foreign key relationship
ALTER TABLE "Product"
ADD CONSTRAINT "Product_sellerId_fkey"
FOREIGN KEY ("sellerId")
REFERENCES "User"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;