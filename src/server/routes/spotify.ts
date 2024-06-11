import axios from "axios";
import express from "express";
import type { Request } from "express";
import { v4 as uuidv4 } from "uuid";

const spotifyRouter = express.Router();

spotifyRouter.use(async (req, res, next) => {
  const currentEpochTime = Math.floor(Date.now() / 1000);
  if (req.session.spotifyAccessToken && req.session.expirationEpochTime && currentEpochTime < req.session.expirationEpochTime) {
    next()
  } else if (req.session.spotifyRefreshToken && process.env.SPOTIFY_CLIENT_ID) {
    const url = "https://accounts.spotify.com/api/token";

    const payload =
      new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: req.session.spotifyRefreshToken,
        client_id: process.env.SPOTIFY_CLIENT_ID
      })


    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    if (response.status === 200) {
      const { access_token, refresh_token, expires_in } = response.data;
      if (access_token) {
        req.session.spotifyAccessToken = access_token;
      }
      if (refresh_token) {
        req.session.spotifyRefreshToken = refresh_token;
      }
      if (expires_in) {
        req.session.expirationEpochTime = Math.floor(Date.now() / 1000) + expires_in
      }
    }
    next()

  } else {
    console.error("No session")
    res.sendStatus(500)
  }
})

spotifyRouter.post("/authorize", (req, res) => {
  if (req.session.spotifyAccessToken && req.session.spotifyRefreshToken) {
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
        if (tokenRes.data.access_token) {
          req.session.spotifyAccessToken = tokenRes.data.access_token;
        }
        if (tokenRes.data.refresh_token) {
          req.session.spotifyRefreshToken = tokenRes.data.refresh_token;
        }
        if (tokenRes.data.expires_in) {
          req.session.expirationEpochTime = Math.floor(Date.now() / 1000) + tokenRes.data.expires_in
        }
        res.redirect("/api/user/data");
      } else {
        res.redirect("/?error=failed_token_post");
      }
    }
  }
);

spotifyRouter.get("/top_tracks", async (req, res) => {
  const result = await axios.get("https://api.spotify.com/v1/me/top/tracks", { headers: { Authorization: `Bearer ${req.session.spotifyAccessToken}` } });
  res.json(result.data)
});


export default spotifyRouter;
