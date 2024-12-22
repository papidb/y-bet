import { Elysia, t } from "elysia";

import cors from "@elysiajs/cors";
import WebSocket from "ws";
import { NOTIFICATION_CHANNEL } from "./constants";
import { pubClient, subClient } from "./lib/redis";

import dotenv from "dotenv";
import { createGameCron, updateGameCron } from "./crons";
import { createBet, getActiveGames, getBets } from "./db";

dotenv.config();

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
  .get("/games", () => {
    return getActiveGames();
  })
  .post(
    "/bets",
    ({ body, error }) => {
      return createBet(body);
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
    return getBets();
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

  return getActiveGames();
});

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
