/*
  Warnings:

  - You are about to drop the `password` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "password" DROP CONSTRAINT "password_user_id_fkey";

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "email" DROP NOT NULL;

-- DropTable
DROP TABLE "password";
