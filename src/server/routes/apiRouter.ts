import express from "express";
import SpotifyRouter from "./spotify";
import UserRouter from "./user";

const apiRouter = express.Router();

apiRouter.use("/spotify", SpotifyRouter);
apiRouter.use("/user", UserRouter);

export default apiRouter;
