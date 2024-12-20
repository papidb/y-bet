import cron, { Patterns } from "@elysiajs/cron";
import { faker } from "@faker-js/faker";
import { randFootballTeam } from "@ngneat/falso";
import { PrismaClient } from "@prisma/client";
import { NOTIFICATION_CHANNEL } from "./constants";
import { publish } from "./lib/redis";

const db = new PrismaClient();

export const createGameCron = cron({
  name: "createGame",
  pattern: Patterns.everySenconds(60),
  async run() {
    const game = await db.game.create({
      data: {
        awayScore: 0,
        homeScore: 0,
        startTime: new Date(),
        awayTeam: randFootballTeam(),
        homeTeam: randFootballTeam(),
      },
    });
    const odds = await db.odds.create({
      data: {
        away: faker.number.int({ min: 0, max: 1 }),
        draw: faker.number.int({ min: 0, max: 1 }),
        home: faker.number.int({ min: 0, max: 1 }),
        gameId: game.id,
      },
    });

    publish(NOTIFICATION_CHANNEL, {
      type: "createGame",
      data: { game, odds },
    });
  },
});

export const updateGameCron = cron({
  name: "updateGame",
  pattern: Patterns.everySecond(),
  async run() {
    const game = await db.game.findFirst({
      where: {
        startTime: {
          lt: new Date(),
        },
      },
    });
    if (!game) {
      console.log("no games to update");
      return;
    }

    const odds = await db.odds.findFirst({
      where: {
        gameId: game.id,
      },
    });

    if (!odds) {
      console.log("no odds for game");
      return;
    }

    db.game.update({
      where: {
        id: game.id,
      },
      data: {
        homeScore: 2,
        awayScore: 0,
      },
    });
  },
});
