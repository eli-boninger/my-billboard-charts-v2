import express from "express";
import SpotifyRouter from "./spotify";
import UserRouter from "./user";
import authRouter from "./auth";
import verifyGoogleToken from "../middleware/googleAuthMiddleware";

const apiRouter = express.Router();

apiRouter.use("/spotify", verifyGoogleToken, SpotifyRouter);
apiRouter.use("/user", verifyGoogleToken, UserRouter);
apiRouter.use("/auth", authRouter)

export default apiRouter;
