import { Redis } from "ioredis";

export const REDIS_CONNECTION = {
  host: process.env.REDIS_HOST,
  port: 6379,
};

if (!process.env.REDIS_HOST) {
  throw new Error("REDIS_HOST is not defined in environment files.");
}

/** Load Redis */
const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: 6379,
});

redisClient.on("error", (err) => {
  console.log("[Redis] - error: ", err);
});

redisClient.on("connect", () => {
  console.log("[Redis] - Connected");
});

export default redisClient;
