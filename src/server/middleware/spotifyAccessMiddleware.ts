import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import axios from 'axios';

const prisma = new PrismaClient()

export const setSpotifyAuth = async (req: Request, accessToken?: string, expiresIn?: number, refreshToken?: string) => {
    if (accessToken) {
        req.session.spotifyAccessToken = accessToken;
    }
    if (expiresIn) {
        req.session.expirationEpochTime = Math.floor(Date.now() / 1000) + expiresIn
    }
    await prisma.user.update({ where: { id: req.session.userId }, data: { spotifyRefreshToken: refreshToken, spotifyAuthorized: true } })
}

const spotifyOAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const currentEpochTime = Math.floor(Date.now() / 1000);

    // If user has an unexpired token, do nothing
    if (req.session.spotifyAccessToken && req.session.expirationEpochTime && currentEpochTime < req.session.expirationEpochTime) {
        return next()
    }
    const user = await prisma.user.findUnique({ where: { id: req.session.userId } });

    // If user's token is expired but they have a refresh token, execute the refresh flow
    if (user?.spotifyRefreshToken && process.env.SPOTIFY_CLIENT_ID) {
        const url = "https://accounts.spotify.com/api/token";

        const payload =
            new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: user.spotifyRefreshToken,
            })

        try {
            const response = await axios.post(url, payload, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + (Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64'))
                }
            })
            if (response.status === 200) {
                const { access_token, refresh_token, expires_in } = response.data;
                await setSpotifyAuth(req, access_token, expires_in, refresh_token);
            }
        } catch (err) {
            console.error("Error refreshing token:", err)
            return res.status(500).send("Error refreshng token");
        }

        next()

    } else {
        // if user has no valid token and no refresh token, they need to initiate the authorization flow
        res.sendStatus(403);
    }
}

export default spotifyOAuthMiddleware;