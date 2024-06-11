-- AlterTable
ALTER TABLE "user" ALTER COLUMN "hashed_password" DROP NOT NULL,
ALTER COLUMN "salt" DROP NOT NULL;
