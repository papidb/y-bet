import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export function getActiveGames() {
  const sixtySecondsAgo = new Date(Date.now() - 60 * 1000);
  return db.game.findMany({
    where: {
      startTime: {
        gte: sixtySecondsAgo,
      },
    },
    include: {
      Odds: true,
    },
  });
}

export function createBet(body: {
  amount: number;
  type: string;
  gameId: string;
}) {
  return db.bet.create({
    data: {
      amount: body.amount,
      type: body.type,
      gameId: body.gameId,
      username: "currentUser",
    },
    include: {
      game: true,
    },
  });
}

export function getBets() {
  return db.bet.findMany({
    include: {
      game: true,
    },
  });
}
