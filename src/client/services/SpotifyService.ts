export const authorizeSpotify = async () => {
  fetch("api/spotify/authorize", { method: "POST", mode: "no-cors" });
};

export const getUserSession = async (): Promise<boolean> => {
  const res = await fetch("api/user/session");
  const resJson = await res.json();
  return Boolean(resJson);
};
