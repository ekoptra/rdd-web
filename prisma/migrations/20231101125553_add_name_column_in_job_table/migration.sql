/*
  Warnings:

  - Added the required column `name` to the `job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "job" ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "started_at" DROP NOT NULL,
ALTER COLUMN "finished_at" DROP NOT NULL;
