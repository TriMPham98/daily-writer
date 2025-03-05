-- CreateTable
CREATE TABLE "WritingEntry" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "wordCount" INTEGER NOT NULL,
    "targetWordCount" INTEGER NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "lastModified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WritingEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WritingEntry_date_idx" ON "WritingEntry"("date");
