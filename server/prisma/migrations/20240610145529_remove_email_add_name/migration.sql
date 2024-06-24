/*
  Warnings:

  - You are about to drop the column `email` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `hashed_password` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `salt` on the `user` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "user_email_key";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "email",
DROP COLUMN "hashed_password",
DROP COLUMN "salt",
ADD COLUMN     "name" TEXT;
