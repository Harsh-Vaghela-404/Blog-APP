/*
  Warnings:

  - Added the required column `token` to the `bloguser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bloguser" ADD COLUMN     "token" TEXT NOT NULL;
