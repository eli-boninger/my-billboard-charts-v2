import express from "express";
import { User } from "../models/User";

const userRouter = express.Router();

userRouter.get("/data", async (req, res) => {
  if (!req.session.spotifyAccessToken) {
    return res.status(401);
  }
  const result = await fetch("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${req.session.spotifyAccessToken}` },
  });
  if (result.status !== 200) {
    return res.status(401);
  }

  const resultJson = await result.json();

  try {
    await User.create({
      email: resultJson.email,
      spotifyAuthorized: true,
      spotifyRefreshToken: req.session.spotifyRefreshToken,
    });
    res.send(resultJson.email);
  } catch (e) {
    console.error(e);
    res.status(500);
  }
});

userRouter.get("/session", (req, res) => {
  console.dir(req.session);
  if (req.session.spotifyAccessToken) {
    res.send(true);
  } else if (req.session.spotifyRefreshToken) {
    // TODO: refresh logic here
    res.send(true);
  } else {
    res.send(false);
  }
});

export default userRouter;
