import { Elysia, t } from "elysia";

import { PrismaClient } from "@prisma/client";

import cors from "@elysiajs/cors";
import WebSocket from "ws";
import { NOTIFICATION_CHANNEL } from "./constants";
import { createGameCron, updateGameCron } from "./crons";
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
  // .derive(({ request }) => userMiddleware(request))
  // .all("/api/auth/*", betterAuthView)
  // .get("/user", ({ user, session }) => userInfo(user, session))
  .post(
    "/bets",
    ({ body, error }) => {
      return db.bet.create({
        data: {
          amount: body.amount,
          type: body.type,
          gameId: body.gameId,
          username: "currentUser",
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
  .get("/bets", () => {
    return db.bet.findMany({});
  })
  .get("/", () => "Hello World!")
  .use(createGameCron)
  .use(updateGameCron)
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
