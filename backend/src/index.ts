import { Elysia, t } from "elysia";
import statusCodes from "http-status-codes";

import { PrismaClient } from "@prisma/client";
import { betterAuthView, userInfo, userMiddleware } from "./lib/better-auth";

import cors from "@elysiajs/cors";
import WebSocket from "ws";
import { NOTIFICATION_CHANNEL } from "./constants";
import { heartBeatCron } from "./crons";
import { pubClient, subClient } from "./lib/redis";

import dotenv from "dotenv";

dotenv.config();

const db = new PrismaClient();

enum BetType {
  home = "home",
  away = "away",
  draw = "draw",
}

const app = new Elysia()
  .use(
    cors({
      origin: process.env.ALLOWED_ORIGIN,
      allowedHeaders: ["Content-Type", "Authorization"],
      methods: ["POST", "GET", "OPTIONS"],
      exposeHeaders: ["Content-Length"],
      maxAge: 600,
      credentials: true,
    })
  )
  .derive(({ request }) => userMiddleware(request))
  .all("/api/auth/*", betterAuthView)
  .get("/user", ({ user, session }) => userInfo(user, session))
  .post(
    "/bets",
    ({ body, user, error }) => {
      if (!user) {
        return error(statusCodes.METHOD_NOT_ALLOWED, {
          message: "You must be logged in to create a bet",
        });
      }
      return db.bet.create({
        data: {
          amount: body.amount,
          type: body.type,
          gameId: body.gameId,
          userId: user.id,
        },
      });
    },
    {
      body: t.Object({
        amount: t.Number({
          minimum: 10,
          maximum: 100,
        }),
        gameId: t.String(),
        type: t.Enum(BetType),
      }),
    }
  )
  .get(
    "/bets/:id",
    ({ params: { id } }) => {
      return db.bet.findMany({
        where: {
          userId: id,
        },
      });
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )
  .get("/", () => "Hello World!")
  .use(heartBeatCron)
  .listen(process.env.PORT ?? 3000);

// websocket server
const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws) => {
  // Subscribe to the Redis channel on a new WebSocket connection
  subClient.subscribe(NOTIFICATION_CHANNEL, (message) => {
    ws.send(message);
  });

  ws.on("message", (message) => {
    // Publish the message from WebSocket to the Redis channel
    pubClient.publish(NOTIFICATION_CHANNEL, message.toString());
  });
});

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
