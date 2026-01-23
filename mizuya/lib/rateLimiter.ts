import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.tokenBucket(5, "30 s", 10)
});

export async function checkRateLimit(ip: string) {
  return await ratelimit.limit(ip);
}