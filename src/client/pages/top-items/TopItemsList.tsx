import { TopItemType } from "../../models/TopItem";
import { SpotifyTopItemsRequestResult } from "../../models/SpotifyApiModels";
import { TopItemsListItem } from "./TopItemsListItem";

interface Props {
  topItemType: TopItemType;
  topItems: SpotifyTopItemsRequestResult;
}

export const TopItemsList = (props: Props) => {
  const { topItemType, topItems } = props;
  return (
    <div style={{ width: "100%", maxWidth: 360 }}>
      {topItems.items.map((item, index) => (
        <TopItemsListItem key={item.id} topItem={item} index={index} />
      ))}
    </div>
  );
};
