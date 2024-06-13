import { SpotifyTopResultItem } from "../../models/SpotifyApiModels";

interface Props {
  topItem: SpotifyTopResultItem;
  index: number;
}

export const TopItemsListItem = (props: Props) => {
  const { topItem, index } = props;
  return (
    <div>
      <span className="mx-2.5 text-xl font-bold">{index + 1}</span>
      <span className="min-w-80 mx-2.5 w-80">
        {/* {rankChange !== null && rankChange !== 0 && (
          <span>
            {rankChange! > 0 ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}{" "}
            {Math.abs(rankChange!)}
          </span>
        )} */}
      </span>

      <span className="text-base">{topItem.name}</span>
    </div>
  );
};
