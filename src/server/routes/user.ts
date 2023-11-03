import express from "express";
import type { Request } from "express";

const userRouter = express.Router();

userRouter.get("/data", (req, res) => {
  res.send(
    `${req.session.spotifyAccessToken} -- ${req.session.spotifyRefreshToken}`
  );
});

export default userRouter;
