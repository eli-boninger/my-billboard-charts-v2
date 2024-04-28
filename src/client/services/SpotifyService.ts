import axios from "axios";

export const authorizeSpotify = async () => {
  const res = await axios.post("api/spotify/authorize");
  window.location = res.data;
};

export const getUserSession = async (): Promise<boolean> => {
  const res = await fetch("api/user/session");
  const resJson = await res.json();
  return Boolean(resJson);
};
