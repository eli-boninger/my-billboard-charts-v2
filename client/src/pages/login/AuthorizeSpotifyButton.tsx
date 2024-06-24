import { useContext } from "react";
import { ButtonBase } from "../../components/ButtonBase";
import SpotifyService from "../../services/SpotifyService";
import { UserContext } from "../../context/UserContext";

export const AuthorizeSpotifyButton = () => {
  const user = useContext(UserContext);
  return user ? (
    <ButtonBase
      onClick={() => SpotifyService.instance.authorizeSpotify(user)}
      className="border-black dark:border-white dark:text-white self-center hover:text-white hover:bg-black dark:hover:text-black dark:hover:bg-white"
    >
      Authorize spotify
    </ButtonBase>
  ) : (
    <div>no user</div>
  );
};
