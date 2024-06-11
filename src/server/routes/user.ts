import express from "express";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();
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
    // let existingUser = await prisma.user.findUnique({
    // where: {
    // email: resultJson.email
    // }
    // })
    // if (!existingUser) {
    //   existingUser = await prisma.user.create({
    //     data: {
    //       email: resultJson.email,
    //       spotifyAuthorized: true,
    //       spotifyRefreshToken: req.session.spotifyRefreshToken,
    //     },
    //   });
    // }
    // req.session.userId = existingUser?.id;
    res.redirect("/")
  } catch (e) {
    console.error(e);
    res.status(500);
  }
});

userRouter.get("/session", (req, res) => {
  if (!!req.session.googleId) {
    res.status(200).send(true);
  } else {
    res.status(200).send(false)
  }
});

export default userRouter;
