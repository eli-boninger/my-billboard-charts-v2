import SpotifyService from "../../services/SpotifyService";
import { TopItemsList } from "./TopItemsList";
import { Tabs, Tab } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";

interface Props {
  topItemType: TopItemType;
}

const TopItems = (props: Props) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [tracks, setTracks] = useState<TopItem[]>([]);
  const [artists, setArtists] = useState<TopItem[]>([]);
  // const { tracks, artists } = useLoaderData() as Awaited<
  //   ReturnType<typeof loader>
  // >;
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
      <Tabs
        value={selectedTab}
        className="mb-3"
        onChange={(e, newValue: number) => setSelectedTab(newValue)}
      >
        <Tab
          label="Tracks"
          id="tab-panel-tracks"
          aria-controls="tab-panel-tracks"
        />
        <Tab
          label="Artists"
          id="tab-panel-artists"
          aria-controls="tab-panel-artists"
        />
      </Tabs>
      <CustomTabPanel value={selectedTab} index={0} panelName="tracks">
        <TopItemsList topItemType="TRACK" topItems={tracks || []} />
      </CustomTabPanel>
      <CustomTabPanel value={selectedTab} index={1} panelName="artists">
        <TopItemsList topItemType="ARTIST" topItems={artists || []} />
      </CustomTabPanel>
    </>
  );
};

function CustomTabPanel({
  value,
  index,
  children,
  panelName,
}: {
  value: number;
  index: number;
  children: React.ReactNode;
  panelName: string;
}) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tab-panel-${panelName}`}
      aria-labelledby={`tab-panel-${panelName}`}
    >
      {value === index && <div>{children}</div>}
    </div>
  );
}

export default TopItems;
