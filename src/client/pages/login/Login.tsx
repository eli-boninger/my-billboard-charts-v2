import { useEffect } from "react";
import { getUserSession } from "../../services/SpotifyService";
import { Header } from "./Header";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const navigate = useNavigate();
  useEffect(() => {
    async function getSession() {
      const hasSession = await getUserSession();
      if (hasSession) {
        navigate("/tracks");
      }
    }
    getSession();
  }, []);

  return (
    <div className="flex flex-row justify-center ">
      <div className="flex flex-col gap-10 my-20">
        <Header />
        <div
          id="g_id_onload"
          data-client_id="653090121846-kta0c86afjjbtuav600shhaov6366v4e.apps.googleusercontent.com"
          data-context="signin"
          data-ux_mode="popup"
          data-login_uri="http://localhost:3000/api/auth/login"
          data-auto_prompt="false"
        ></div>

        <div
          className="g_id_signin"
          data-type="standard"
          data-shape="pill"
          data-theme="outline"
          data-text="continue_with"
          data-size="large"
          data-logo_alignment="center"
          data-width="250"
        ></div>
      </div>
    </div>
  );
};
