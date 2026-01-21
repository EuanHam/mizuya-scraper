import {Ratelimit} from "@upstash/ratelimit";
import {Redis} from "@upstash/redis";
 
 
const redis = new Redis({
  url: 'UPSTASH_REDIS_REST_URL',
  token: 'UPSTASH_REDIS_REST_TOKEN',
})
 
// Create a new ratelimiter, that allows 5 requests per 60 seconds
const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.fixedWindow(5, "60 s"),
});