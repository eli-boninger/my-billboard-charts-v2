import express from "express";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();
const userRouter = express.Router();


userRouter.get("/session", (req, res) => {
  if (!!req.session.googleId) {
    res.status(200).send(true);
  } else {
    res.status(200).send(false)
  }
});

export default userRouter;
