import { useEffect, useRef } from "react";
import SpotifyService from "../../services/SpotifyService";
import { Header } from "./Header";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

export const Login = () => {
  const navigate = useNavigate();
  const divRef = useRef(null);
  const [_, setCookie] = useCookies();

  function handleCredentialResponse(response: { credential: string }) {
    setCookie("google_auth_token", response.credential);
    navigate("/top_items");
  }

  function showGoogleLogin() {
    if (divRef.current) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID,
        callback: handleCredentialResponse,
      });
      window.google.accounts.id.renderButton(divRef.current, {
        theme: "filled_blue",
        size: "large",
        type: "standard",
        text: "continue_with",
      });
      window.google.accounts.id.prompt();
    }
  }

  useEffect(() => {
    async function getSession() {
      const hasSession = await SpotifyService.instance.getUserSession();
      if (hasSession) {
        navigate("/top_items");
      } else {
        showGoogleLogin();
      }
    }
    getSession();
  }, [divRef.current]);

  return (
    <div className="flex flex-row justify-center ">
      <div className="flex flex-col gap-10 my-20" ref={divRef}>
        <Header />
      </div>
    </div>
  );
};
