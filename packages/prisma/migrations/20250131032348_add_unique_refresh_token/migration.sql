/*
  Warnings:

  - A unique constraint covering the columns `[refreshToken]` on the table `Company` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Company_refreshToken_key" ON "Company"("refreshToken");
