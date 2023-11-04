import { TopItemType } from "../../models/TopItem";
import { TopItemsList } from "./TopItemsList";

interface Props {
  topItemType: TopItemType;
}

export const TopItems = (props: Props) => {
  const { topItemType } = props;
  return <TopItemsList topItemType={topItemType} />;
};
