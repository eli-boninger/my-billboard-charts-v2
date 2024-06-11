/*
  Warnings:

  - Added the required column `hashed_password` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salt` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "email_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hashed_password" TEXT NOT NULL,
ADD COLUMN     "salt" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "session" (
    "sid" VARCHAR NOT NULL,
    "sess" JSON NOT NULL,
    "expire" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
);

-- CreateTable
CREATE TABLE "federated_credentials" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "subject" TEXT NOT NULL,

    CONSTRAINT "federated_credentials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "IDX_session_expire" ON "session"("expire");

-- CreateIndex
CREATE UNIQUE INDEX "federated_credentials_provider_subject_key" ON "federated_credentials"("provider", "subject");

-- AddForeignKey
ALTER TABLE "federated_credentials" ADD CONSTRAINT "federated_credentials_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
