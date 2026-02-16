import { createClient } from "redis";

console.log("Starting Redis test");

const redis = createClient({
  url: process.env.REDIS_URL
});

redis.on("error", (err) => {
  console.error("Redis error:", err);
});

(async () => {
  await redis.connect();
  console.log("Connected to Redis");

  await redis.set("healthcheck", "ok");
  const val = await redis.get("healthcheck");

  console.log("Value from Redis:", val);

  await redis.quit();
  console.log("Redis test finished");
})();
