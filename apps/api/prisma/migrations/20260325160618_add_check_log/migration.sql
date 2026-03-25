-- CreateTable
CREATE TABLE "CheckLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "checkTypeId" TEXT NOT NULL,
    "completedAt" TEXT NOT NULL,
    "notes" TEXT,
    "nextDueAt" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CheckLog_checkTypeId_fkey" FOREIGN KEY ("checkTypeId") REFERENCES "CheckType" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "CheckLog_checkTypeId_idx" ON "CheckLog"("checkTypeId");
