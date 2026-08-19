import { rateLimit } from "express-rate-limit";
import {
  RedisStore,
  type RedisReply,
} from "rate-limit-redis";

import redis from "../config/redis.js";

// export const loginRateLimiter = rateLimit({
//   windowMs: 60 * 1000,
//   limit: 5,

//   store: new RedisStore({
//     sendCommand: (command: string, ...args: string[]) => {
//       return redis.call(command, ...args) as Promise<RedisReply>;
//     },
//   }),

//   message: {
//     success: false,
//     message: "Too many login attempts. Please try again later.",
//   },
// });

export const loginRateLimiter=rateLimit({
  windowMs:1*60*1000,
  limit:5,

  store:new RedisStore({
    sendCommand:(command:string,...args:string[])=>{
      return redis.call(command,...args) as Promise<RedisReply>;
    },
  }),
  message:{
    sucess:false,
    message:"Too many login attempts. Please try again later."

  }
})