import axios from "axios";

export const authorizeSpotify = async () => {
  const res = await axios.post("api/spotify/authorize");
  window.location = res.data;
};

export const getUserSession = async (): Promise<boolean> => {
  try {
    const res = await axios.get("api/user/session");
    return Boolean(res.data)
  } catch (err) {
    return false;
  }
};

export const getUserTopTracks = async () => {
  const res = await axios.get("api/user/top_tracks");
  console.dir(res.data)
}