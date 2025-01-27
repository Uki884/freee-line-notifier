-- CreateEnum
CREATE TYPE "CompanyStatus" AS ENUM ('active', 'inactive');

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "status" "CompanyStatus" NOT NULL DEFAULT 'active';
