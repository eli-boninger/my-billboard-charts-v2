import { useLoaderData } from "react-router-dom";
import { TopItemType } from "../../models/TopItem";
import { getUserTopItems } from "../../services/SpotifyService";
import { TopItemsList } from "./TopItemsList";

interface Props {
  topItemType: TopItemType;
}

async function loader(typePath: string) {
  const items = await getUserTopItems(typePath);
  return { items };
}

const TopItems = (props: Props) => {
  const { topItemType } = props;
  const { items } = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  return <TopItemsList topItemType={topItemType} topItems={items} />;
};

TopItems.loader = loader;
export default TopItems;
