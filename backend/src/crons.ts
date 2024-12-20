import cron, { Patterns } from "@elysiajs/cron";
import { NOTIFICATION_CHANNEL } from "./constants";
import { pubClient } from "./lib/redis";

export const heartBeatCron = cron({
  name: "heartbeat",
  pattern: Patterns.everySenconds(2),
  run() {
    pubClient.publish(NOTIFICATION_CHANNEL, "heartbeat");
  },
});
