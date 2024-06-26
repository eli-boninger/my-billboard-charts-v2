import axios from "axios";
import express from "express";
import type { Request } from "express";
import { v4 as uuidv4 } from "uuid";
import spotifyOAuthMiddleware, { setSpotifyAuth } from "../middleware/spotifyAccessMiddleware";
import { UserServiceError, getTopArtists, getTopTracks, getTrackDetails } from "../services/userService";

const spotifyRouter = express.Router();

spotifyRouter.post("/authorize", (req, res) => {
  if (req.session.spotifyAccessToken) {
    res.sendStatus(204);
  }
  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.SPOTIFY_CLIENT_ID || "",
    scope: process.env.SPOTIFY_SCOPES || "",
    redirect_uri: `${process.env.SERVER_URL}/api/spotify/callback`,
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
        `${process.env.SERVER_URL}/api/spotify/callback`
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
        res.redirect(`${process.env.WEB_APP_URL}/top_items`);
      } else {
        res.redirect(`${process.env.WEB_APP_URL}/?error=failed_token_post`);
      }
    }
  }
);


/********* routes needing existing spotify session *************/

spotifyRouter.use(spotifyOAuthMiddleware);

spotifyRouter.get("/session", async (req, res) => {
  res.status(200).send(true);
})

spotifyRouter.get("/top_tracks", async (req, res) => {
  const result = await getTopTracks(req.session.userId!)
  res.json(result)
});

spotifyRouter.get("/top_artists", async (req, res) => {
  const result = await getTopArtists(req.session.userId!)
  res.json(result)
})

spotifyRouter.get("/top_items/:id/details", async (req, res) => {
  try {
    const result = await getTrackDetails(req.session.userId!, req.params.id);
    res.json(result)
  } catch (e) {
    console.error(e)
    if (e instanceof UserServiceError) {
      res.status(e.statusCode).send(e.message);
    }
  }
})



export default spotifyRouter;
