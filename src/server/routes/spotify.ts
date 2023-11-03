import express from "express";
import type { Request } from "express";
import crypto from "crypto";

const spotifyRouter = express.Router();

spotifyRouter.post("/authorize", (req, res) => {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.SPOTIFY_CLIENT_ID || "",
    scope: process.env.SPOTIFY_SCOPES || "",
    redirect_uri: process.env.SPOTIFY_AUTH_REDIRECT_URL || "",
    state: crypto.randomUUID(),
  });
  res.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
});

spotifyRouter.get(
  "/callback",
  async (req: Request<{}, {}, {}, { state: string; code: string }>, res) => {
    const { state, code } = req.query;
    if (state === null) {
      res.redirect("/?error=state_mismatch");
    } else {
      const params = new URLSearchParams({
        code: code || "",
        redirect_uri: process.env.SPOTIFY_AUTH_REDIRECT_URL || "s",
        grant_type: "authorization_code",
      });

      const tokenRes = await fetch(`https://accounts.spotify.com/api/token`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_API_TOKEN}`
          ).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params,
      });

      if (tokenRes.status === 200) {
        const json = await tokenRes.json();
        if (json.access_token) {
          console.log("access token", json.access_token);
          req.session.spotifyAccessToken = json.access_token;
        }
        if (json.refresh_token) {
          req.session.spotifyRefreshToken = json.refresh_token;
        }
        res.redirect("/api/user/data");
      } else {
        res.redirect("/?error=failed_token_post");
      }
    }
  }
);

export default spotifyRouter;
