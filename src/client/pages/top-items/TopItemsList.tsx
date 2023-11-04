import { TopItemType } from "../../models/TopItem";

interface Props {
  topItemType: TopItemType;
}

export const TopItemsList = (props: Props) => {
  const { topItemType } = props;
  return <div>{topItemType}</div>;
};
