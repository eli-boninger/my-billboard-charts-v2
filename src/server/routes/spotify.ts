import axios from "axios";
import express from "express";
import type { Request } from "express";
import { v4 as uuidv4 } from "uuid";

const spotifyRouter = express.Router();

spotifyRouter.post("/authorize", (req, res) => {
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
    console.log("HERE", state, code);
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
      console.log(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_API_TOKEN}`
      );
      try {
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
      } catch (e) {
        console.log(e);
        throw e;
      }

      if (tokenRes?.status === 200) {
        if (tokenRes.data.access_token) {
          req.session.spotifyAccessToken = tokenRes.data.access_token;
        }
        if (tokenRes.data.refresh_token) {
          req.session.spotifyRefreshToken = tokenRes.data.refresh_token;
        }
        res.redirect("/api/user/data");
      } else {
        res.redirect("/?error=failed_token_post");
      }
    }
  }
);

export default spotifyRouter;
