import "dotenv/config";
import express from "express";
import apiRouter from "./routes/api";
import session from "express-session";
import winston from 'winston';
const { combine, timestamp, printf, colorize, align } = winston.format;
import { updateTopItemsForAllUsers } from "./tasks/updateTopItemsForAllUsers";
import * as admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth'
import { applicationDefault } from "firebase-admin/app";
import cors from 'cors';
import cron from 'node-cron';

const firebaseApp = admin.initializeApp({
  credential: applicationDefault(),
});

export const auth = getAuth();



export const logger = winston.createLogger({
  level: 'info',
  format: combine(
    colorize({ all: true }),
    timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.SSS A',
    }),
    align(),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
  ),
  defaultMeta: { service: 'express-main' },
  transports: [
    new winston.transports.Console()
  ]
})

declare module "express-session" {
  interface SessionData {
    userId: string;
    googleId: string;
    spotifyAccessToken: string;
    expirationEpochTime: number;
  }
}

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.WEB_APP_URL }))

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secure-string",
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
    store: new (require("connect-pg-simple")(session))({
      // Insert connect-pg-simple options here
    }),
    // Boilerplate options, see:
    // * https://www.npmjs.com/package/express-session#resave
    // * https://www.npmjs.com/package/express-session#saveuninitialized
    resave: false,
    saveUninitialized: false,
  })
);

updateTopItemsForAllUsers()
cron.schedule("0 1 * * *", async () => {
  try {
    await updateTopItemsForAllUsers()
  } catch (e) {
    console.error(e)
  }
});

app.use("/api", apiRouter);

app.listen(PORT, () =>
  console.log(`Server is listening on port ${PORT}...`)
);
