import cron, { Patterns } from "@elysiajs/cron";
import { NOTIFICATION_CHANNEL } from "./constants";
import { pubClient, publish } from "./lib/redis";

export const heartBeatCron = cron({
  name: "heartbeat",
  pattern: Patterns.everySenconds(2),
  run() {
    publish(NOTIFICATION_CHANNEL, {
      type: "heartbeat",
    });
  },
});
