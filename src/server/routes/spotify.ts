import { PrismaClient } from "@prisma/client";
import axios from "axios";
import express from "express";
import type { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

const spotifyRouter = express.Router();
const prisma = new PrismaClient()

const setSpotifyAuth = async (req: Request, accessToken?: string, expiresIn?: number, refreshToken?: string) => {
  if (accessToken) {
    req.session.spotifyAccessToken = accessToken;
  }
  if (expiresIn) {
    req.session.expirationEpochTime = Math.floor(Date.now() / 1000) + expiresIn
  }
  await prisma.user.update({ where: { id: req.session.userId }, data: { spotifyRefreshToken: refreshToken, spotifyAuthorized: true } })
}

spotifyRouter.post("/authorize", (req, res) => {
  if (req.session.spotifyAccessToken) {
    res.sendStatus(204);
  }
  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.SPOTIFY_CLIENT_ID || "",
    scope: process.env.SPOTIFY_SCOPES || "",
    redirect_uri: process.env.SPOTIFY_AUTH_REDIRECT_URL || "",
    state: uuidv4(),
  });
  res.send(`https://accounts.spotify.com/authorize?${params.toString()}`);
});

spotifyRouter.get(
  "/callback",
  async (req: Request<{}, {}, {}, { state: string; code: string }>, res) => {
    const { state, code } = req.query;

    if (state === null) {
      res.redirect("/?error=state_mismatch");
    } else {
      const formData = new URLSearchParams();
      formData.append("code", code);
      formData.append(
        "redirect_uri",
        process.env.SPOTIFY_AUTH_REDIRECT_URL || "S"
      );
      formData.append("grant_type", "authorization_code");

      let tokenRes = null;
      tokenRes = await axios.post(
        `https://accounts.spotify.com/api/token`,
        formData,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_API_TOKEN}`
            ).toString("base64")}`,
            "content-type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (tokenRes?.status === 200) {
        const { access_token, refresh_token, expires_in } = tokenRes.data;
        await setSpotifyAuth(req, access_token, expires_in, refresh_token);
        res.redirect("/tracks");
      } else {
        res.redirect("/?error=failed_token_post");
      }
    }
  }
);


/********* routes needing existing spotify session *************/
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

spotifyRouter.use(spotifyOAuthMiddleware);

spotifyRouter.get("/session", async (req, res) => {
  res.status(200).send(true);
})

spotifyRouter.get("/top_tracks", async (req, res) => {
  const result = await axios.get("https://api.spotify.com/v1/me/top/tracks", { headers: { Authorization: `Bearer ${req.session.spotifyAccessToken}` } });
  res.json(result.data)
});


export default spotifyRouter;
