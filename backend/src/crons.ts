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
    try {
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

      console.log("createGame");
      publish(NOTIFICATION_CHANNEL, {
        type: "createGame",
        data: {
          ...game,
          odds,
        },
      });
    } catch (error) {
      console.error(error);
    }
  },
});

export const updateGameCron = cron({
  name: "updateGame",
  pattern: Patterns.everySenconds(5),
  async run() {
    try {
      const sixtySecondsAgo = new Date(Date.now() - 60 * 1000);

      const game = await db.game.findFirst({
        where: {
          startTime: {
            gte: sixtySecondsAgo,
          },
        },
        include: {
          Odds: true,
        },
      });

      if (!game) {
        console.log("no games to update");
        return;
      }

      if (!game.Odds) {
        console.log("no odds for game");
        return;
      }

      const updateGame = await db.game.update({
        where: {
          id: game.id,
        },
        data: {
          homeScore: game.homeScore + faker.number.int({ min: 0, max: 1 }),
          awayScore: game.awayScore + faker.number.int({ min: 0, max: 1 }),
        },
      });

      publish(NOTIFICATION_CHANNEL, {
        type: "oddsUpdate",
        data: {
          gameId: game.id,
          odds: {
            team1: game.Odds.home,
            team2: game.Odds.away,
          },
        },
      });

      publish(NOTIFICATION_CHANNEL, {
        type: "gameData",
        data: {
          gameId: game.id,
          score1: updateGame.homeScore,
          score2: updateGame.awayScore,
          // in seconds (60 seconds = 1 minute)
          timeRemaining: Math.floor(
            (Date.now() - game.startTime.getTime()) / 1000
          ),
        },
      });
    } catch (error) {
      console.error(error);
    }
  },
});
