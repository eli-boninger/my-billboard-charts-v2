import { TopItemType } from "../../models/TopItem";

interface Props {
  topItemType: TopItemType;
  topItems: any[];
}

export const TopItemsList = (props: Props) => {
  const { topItemType, topItems } = props;
  return (
    <div>
      {topItemType}
      <div>{JSON.stringify(topItems.items)}</div>
    </div>
  );
};
