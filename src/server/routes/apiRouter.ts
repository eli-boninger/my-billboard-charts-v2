import express, { Request, Response } from "express";
import SpotifyRouter from "./spotify";
import UserRouter from "./user";
import authRouter from "./auth";
import { OAuth2Client } from "google-auth-library";

const apiRouter = express.Router();
const client = new OAuth2Client();

async function verifyGoogleToken(req: Request & { cookies: any }, res: Response, next: () => void) {
    try {
        if (!req.cookies.google_auth_token) {
            return res.sendStatus(401)
        }
        const ticket = await client.verifyIdToken({
            idToken: req.cookies.google_auth_token,
            audience: process.env.GOOGLE_AUTH_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const userId = payload?.sub;
        if (userId) {
            req.session.googleId = userId
        } else {
            throw "Invalid google auth token"
        }
        next();
    } catch (err) {
        console.error(err);
        res.sendStatus(401)
    }
}


apiRouter.use("/spotify", verifyGoogleToken, SpotifyRouter);
apiRouter.use("/user", verifyGoogleToken, UserRouter);
apiRouter.use("/auth", authRouter)

export default apiRouter;
