import axios from "axios";
import { SpotifyTopItemsRequestResult } from "../models/SpotifyApiModels";

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

export const getUserSpotifySession = async (): Promise<boolean> => {
  try {
    const res = await axios.get("api/spotify/session");
    return Boolean(res.data)
  } catch (err) {
    return false;
  }
};

export const getUserTopItems = async (itemPath: string): Promise<SpotifyTopItemsRequestResult> => {
  const res = await axios.get(`api/spotify/${itemPath}`);
  return res.data;
}