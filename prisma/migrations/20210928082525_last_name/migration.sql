/*
  Warnings:

  - You are about to drop the column `latName` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "latName",
ADD COLUMN     "lastName" TEXT;
