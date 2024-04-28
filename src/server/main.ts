import "dotenv/config";
import express from "express";
import ViteExpress from "vite-express";
import apiRouter from "./routes/apiRouter";
import session from "express-session";

declare module "express-session" {
  interface SessionData {
    spotifyAccessToken: string;
    spotifyRefreshToken: string;
  }
}

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const app = express();
app.use(express.json());

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
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/api", apiRouter);

ViteExpress.listen(app, PORT, () =>
  console.log(`Server is listening on port ${PORT}...`)
);
