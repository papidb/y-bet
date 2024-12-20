-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "homeTeam" TEXT NOT NULL,
    "awayTeam" TEXT NOT NULL,
    "homeScore" INTEGER NOT NULL,
    "awayScore" INTEGER NOT NULL,
    "remainingTime" TEXT NOT NULL,
    "oddsId" TEXT NOT NULL,
    CONSTRAINT "Game_oddsId_fkey" FOREIGN KEY ("oddsId") REFERENCES "Odds" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Odds" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "home" REAL NOT NULL,
    "away" REAL NOT NULL,
    "draw" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "Bet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "gameId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "type" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    CONSTRAINT "Bet_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LeaderboardEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "totalWinnings" REAL NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Game_oddsId_key" ON "Game"("oddsId");