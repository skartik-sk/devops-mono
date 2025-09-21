/*
  Warnings:

  - You are about to drop the `Todo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Todo" DROP CONSTRAINT "Todo_userId_fkey";

-- DropIndex
DROP INDEX "public"."Link_tags_idx";

-- DropIndex
DROP INDEX "public"."Link_title_idx";

-- DropTable
DROP TABLE "public"."Todo";

-- DropTable
DROP TABLE "public"."User";
