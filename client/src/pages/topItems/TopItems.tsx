import SpotifyService from "../../services/SpotifyService";
import { TopItemsList } from "./TopItemsList";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";

interface Props {
  topItemType: TopItemType;
}

const TopItems = (props: Props) => {
  const { topItemType } = props;
  const [tracks, setTracks] = useState<TopItem[]>([]);
  const [artists, setArtists] = useState<TopItem[]>([]);
  const user = useContext(UserContext);

  useEffect(() => {
    async function getTopItems() {
      const tracks = await SpotifyService.instance.getTopItems("tracks", user!);
      const artists = await SpotifyService.instance.getTopItems(
        "artists",
        user!
      );
      setTracks(tracks || []);
      setArtists(artists || []);
    }
    if (user) {
      getTopItems();
    }
  }, [user]);

  return (
    <>
      {topItemType === "TRACK" ? (
        <TopItemsList topItemType="TRACK" topItems={tracks || []} />
      ) : (
        <TopItemsList topItemType="ARTIST" topItems={artists || []} />
      )}
    </>
  );
};

export default TopItems;
