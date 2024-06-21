import { useRef } from "react";
import { Header } from "./Header";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../services/Firebase";
import { Button } from "@mui/material";

export const Login = () => {
  const navigate = useNavigate();
  const divRef = useRef(null);
  const provider = new GoogleAuthProvider();

  const handleClick = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        navigate("/top_tracks");
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };

  return (
    <div className="flex flex-row justify-center ">
      <div className="flex flex-col gap-10 my-20" ref={divRef}>
        <Header />
        <div
          className="g_id_signin"
          data-type="standard"
          data-size="large"
          data-theme="outline"
          data-text="sign_in_with"
          data-shape="rectangular"
          data-logo_alignment="left"
        ></div>
        <Button onClick={handleClick}>Log in</Button>
      </div>
    </div>
  );
};
