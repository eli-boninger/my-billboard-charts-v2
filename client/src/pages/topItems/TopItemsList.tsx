import { List } from "@mui/material";
import { TopItemsListItem } from "./TopItemsListItem";

interface Props {
  topItemType: TopItemType;
  topItems: TopItem[];
}

export const TopItemsList = (props: Props) => {
  const { topItems } = props;
  return (
    <List dense className="w-full">
      {topItems.map((item: TopItem, index: number) => (
        <TopItemsListItem key={item.id} topItem={item} index={index} />
      ))}
    </List>
  );
};
