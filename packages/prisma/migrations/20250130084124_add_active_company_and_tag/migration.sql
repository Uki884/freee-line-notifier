/*
  Warnings:

  - You are about to drop the column `status` on the `Company` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[activeCompanyId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `activeCompanyId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "activeCompanyId" TEXT NOT NULL;

-- DropEnum
DROP TYPE "CompanyStatus";

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_userId_key" ON "Company"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_activeCompanyId_key" ON "User"("activeCompanyId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_activeCompanyId_fkey" FOREIGN KEY ("activeCompanyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
