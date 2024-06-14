import { ListGroup } from "react-bootstrap";
import { TopItemsListItem } from "./TopItemsListItem";

interface Props {
  topItemType: TopItemType;
  topItems: TopItem[];
}

export const TopItemsList = (props: Props) => {
  const { topItems } = props;
  return (
    <ListGroup>
      {topItems.map((item: TopItem, index: number) => (
        <TopItemsListItem key={item.id} topItem={item} index={index} />
      ))}
    </ListGroup>
  );
};
