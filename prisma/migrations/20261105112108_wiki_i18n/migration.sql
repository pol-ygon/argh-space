-- AlterTable
ALTER TABLE "pages" ADD COLUMN     "key" TEXT;

-- AlterTable
ALTER TABLE "sections" ADD COLUMN     "key" TEXT,
ADD COLUMN     "lang" TEXT NOT NULL DEFAULT 'it';
