import { List } from "@mui/material";
import { TopItemsListItem } from "./TopItemsListItem";

interface Props {
  topItemType: TopItemType;
  topItems: TopItem[];
}

export const TopItemsList = (props: Props) => {
  const { topItems } = props;
  return (
    <List
      dense
      sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
    >
      {topItems.map((item: TopItem, index: number) => (
        <TopItemsListItem key={item.id} topItem={item} index={index} />
      ))}
    </List>
  );
};
