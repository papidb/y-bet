import dotenv from "dotenv";
import { Elysia, t } from "elysia";
import { NOTIFICATION_CHANNEL } from "./constants";
import cors from "./cors";
import { createGameCron, updateGameCron } from "./crons";
import { createBet, getActiveGames, getBets } from "./db";
import { pubClient, subClient } from "./lib/redis";

dotenv.config();

enum BetType {
  home = "home",
  away = "away",
  draw = "draw",
}

const app = new Elysia()
  .use(cors)
  .get("/games", getActiveGames)
  .get("/bets", getBets)
  .post("/bets", ({ body }) => createBet(body), {
    body: t.Object({
      amount: t.Number({
        minimum: 10,
        maximum: 100,
      }),
      gameId: t.String(),
      type: t.Enum(BetType),
    }),
  })
  .get("/", () => "Hello World!")
  .use(createGameCron)
  .use(updateGameCron)
  .ws("/ws", {
    open(ws) {
      // Subscribe to the Redis channel on a new WebSocket connection
      subClient.subscribe(NOTIFICATION_CHANNEL, (message) => {
        ws.send(message);
      });
    },
    message(_, message) {
      pubClient.publish(NOTIFICATION_CHANNEL, message as string);
    },
  })
  .listen(process.env.PORT ?? 3000);

// // websocket server
// const wss = new WebSocket.Server({ port: 8080 });

// wss.on("connection", (ws) => {
//   // Subscribe to the Redis channel on a new WebSocket connection
//   subClient.subscribe(NOTIFICATION_CHANNEL, (message) => {
//     ws.send(message);
//   });

//   ws.on("message", (message) => {
//     // Publish the message from WebSocket to the Redis channel
//     pubClient.publish(NOTIFICATION_CHANNEL, message.toString());
//   });

//   return getActiveGames();
// });

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
