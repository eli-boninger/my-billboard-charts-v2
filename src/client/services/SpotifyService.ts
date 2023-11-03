export const authorizeSpotify = async () => {
  fetch("api/spotify/authorize", { method: "POST", mode: "no-cors" });
};
