import redis from "redis";

const pubClient = redis.createClient({ url: process.env.REDIS_URL });
const subClient = pubClient.duplicate();

pubClient
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();

subClient
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();
const publish = (channel: string, message: any) => {
  pubClient.publish(channel, JSON.stringify(message));
};

export { pubClient, publish, subClient };
