import "dotenv/config";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import { RedisStore } from "connect-redis";

import errorMiddleware from "./middleware/errorMiddleware.js";
import routes from "./routes/mainRoutes.js";
import redis from "./config/redis.js";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(
  session({
    store: new RedisStore({
      client: redis,
    }),

    secret: process.env.SESSION_SECRET!,

    resave: false,

    saveUninitialized: false,

    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);

app.use("/api", routes);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
