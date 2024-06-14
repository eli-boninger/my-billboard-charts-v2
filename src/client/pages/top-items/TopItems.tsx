import { useLoaderData } from "react-router-dom";
import { getUserTopItems } from "../../services/SpotifyService";
import { TopItemsList } from "./TopItemsList";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

interface Props {
  topItemType: TopItemType;
}

async function loader(typePath: string) {
  const tracks = await getUserTopItems("tracks");
  const artists = await getUserTopItems("artists");
  return { tracks, artists };
}

const TopItems = (props: Props) => {
  const { topItemType } = props;
  const { tracks, artists } = useLoaderData() as Awaited<
    ReturnType<typeof loader>
  >;

  return (
    <Tabs defaultActiveKey={topItemType} className="mb-3">
      <Tab eventKey="tracks" title="Tracks">
        <TopItemsList topItemType="TRACK" topItems={tracks || []} />
      </Tab>
      <Tab eventKey="artists" title="Artists">
        <TopItemsList topItemType="ARTIST" topItems={artists || []} />
      </Tab>
    </Tabs>
  );
};

TopItems.loader = loader;
export default TopItems;
