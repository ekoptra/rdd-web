/*
  Warnings:

  - You are about to drop the column `progress` on the `job` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "JobStatus" ADD VALUE 'CANCELED';

-- AlterTable
ALTER TABLE "job" DROP COLUMN "progress",
ADD COLUMN     "conf" DOUBLE PRECISION NOT NULL DEFAULT 0.2,
ADD COLUMN     "show_conf" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "show_labels" BOOLEAN NOT NULL DEFAULT true;
