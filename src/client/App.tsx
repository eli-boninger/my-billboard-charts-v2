import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import SpotifyService from "./services/SpotifyService";
import { AuthorizeSpotifyButton } from "./pages/login/AuthorizeSpotifyButton";
import UserService from "./services/UserService";

function App() {
  const navigate = useNavigate();
  const [isSpotifyAuthorized, setIsSpotifyAuthorized] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    async function getSession() {
      const currentSession = await UserService.instance.getUserSession();
      if (!currentSession) {
        setHasSession(false);
        navigate("/login");
      } else {
        setHasSession(true);
      }

      const hasSpotifyAuth = await SpotifyService.instance.getSpotifySession();
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
        {!isSpotifyAuthorized && hasSession && <AuthorizeSpotifyButton />}
        <Outlet />
      </div>
    </div>
  );
}

export default App;
