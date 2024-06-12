import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Outlet, useNavigate } from "react-router-dom";
import {
  getUserSession,
  getUserSpotifySession,
} from "./services/SpotifyService";
import { AuthorizeSpotifyButton } from "./pages/login/AuthorizeSpotifyButton";

function App() {
  const navigate = useNavigate();
  const [isSpotifyAuthorized, setIsSpotifyAuthorized] = useState(false);

  useEffect(() => {
    async function getSession() {
      const hasSession = await getUserSession();
      if (hasSession) {
        navigate("/tracks");
      } else {
        navigate("/login");
      }

      const hasSpotifyAuth = await getUserSpotifySession();
      if (hasSpotifyAuth) {
        setIsSpotifyAuthorized(true);
      }
    }
    getSession();
  }, []);

  return (
    <div className="bg-white dark:bg-black h-screen text-black dark:text-white">
      <div
        id="g_id_onload"
        data-client_id="653090121846-kta0c86afjjbtuav600shhaov6366v4e.apps.googleusercontent.com"
        data-login_uri="http://localhost:3000/api/auth/login"
        data-skip_prompt_cookie="google_auth_token"
      >
        {!isSpotifyAuthorized && <AuthorizeSpotifyButton />}
        <Outlet />
      </div>
    </div>
  );
}

export default App;
