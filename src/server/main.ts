import "dotenv/config";
import express from "express";
import ViteExpress from "vite-express";
import mongoose from "mongoose";
import { ServerApiVersion } from "mongodb";
import apiRouter from "./routes/apiRouter";
import session from "express-session";
import connectMongoDBSession from "connect-mongodb-session";
import crypto from "crypto";

declare module "express-session" {
  interface SessionData {
    spotifyAccessToken: string;
    spotifyRefreshToken: string;
  }
}

const MongoDBStore = connectMongoDBSession(session);
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const app = express();
app.use(express.json());

mongoose
  .connect(process.env.ATLAS_URI || "", {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  })
  .then(() => console.log("connected to mongo db"))
  .catch((e) => console.error(e));

const store = new MongoDBStore({
  uri: process.env.ATLAS_URI || " ",
  collection: "sessions",
});

// Catch errors
store.on("error", function (error) {
  console.log(error);
});

app.use(
  session({
    secret: crypto.randomUUID(),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
    store: store,
    // Boilerplate options, see:
    // * https://www.npmjs.com/package/express-session#resave
    // * https://www.npmjs.com/package/express-session#saveuninitialized
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/api", apiRouter);

ViteExpress.listen(app, PORT, () =>
  console.log(`Server is listening on port ${PORT}...`)
);
