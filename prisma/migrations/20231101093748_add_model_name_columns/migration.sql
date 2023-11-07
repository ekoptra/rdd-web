/*
  Warnings:

  - Added the required column `model_name` to the `job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "job" ADD COLUMN     "model_name" TEXT NOT NULL;
