import "dotenv/config";
import express from "express";
import ViteExpress from "vite-express";
import mongoose from "mongoose"
import { ServerApiVersion } from "mongodb";

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

mongoose.connect(process.env.ATLAS_URI || "", {serverApi: {
  version: ServerApiVersion.v1,
  strict: true,
  deprecationErrors: true,
}}).then(() => console.log("connected to mongo db")).catch((e) => console.error(e))

const app = express();
app.use(express.json());

ViteExpress.listen(app, PORT, () =>
  console.log(`Server is listening on port ${PORT}...`)
);



