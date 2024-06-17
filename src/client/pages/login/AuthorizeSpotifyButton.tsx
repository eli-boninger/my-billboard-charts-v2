import { ButtonBase } from "../../components/ButtonBase";
import SpotifyService from "../../services/SpotifyService";

export const AuthorizeSpotifyButton = () => {
  return (
    <ButtonBase
      onClick={() => SpotifyService.instance.authorizeSpotify()}
      className="border-black dark:border-white dark:text-white self-center hover:text-white hover:bg-black dark:hover:text-black dark:hover:bg-white"
    >
      Authorize spotify
    </ButtonBase>
  );
};
