import { useState, useEffect } from "react";
import { getUserSession } from "../../services/SpotifyService";
import { Header } from "./Header";
import { AuthorizeSpotifyButton } from "./AuthorizeSpotifyButton";

export const Login = () => {
  const [hasSession, setHasSession] = useState(true);

  useEffect(() => {
    async function getSession() {
      const sess = await getUserSession();
      setHasSession(sess);

      if (sess) {
      }
    }
    getSession();
  }, []);

  return (
    <div className="flex flex-row justify-center ">
      <div className="flex flex-col gap-10 my-20">
        <Header />
        {!hasSession && <AuthorizeSpotifyButton />}
      </div>
    </div>
  );
};
