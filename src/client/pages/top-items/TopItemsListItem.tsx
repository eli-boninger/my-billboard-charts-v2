import { ListGroup } from "react-bootstrap";
// import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";

interface Props {
  topItem: TopItem;
  index: number;
}

export const TopItemsListItem = (props: Props) => {
  const { topItem, index } = props;

  const labelId = `list-item-label-${topItem.id}`;
  const rankChange = topItem.previousRank
    ? topItem.rank - topItem.previousRank
    : null;
  return (
    <ListGroup.Item>
      <span className="mx-2.5 text-xl font-bold">{index + 1}</span>
      <span className="min-w-80 mx-2.5 w-80">
        {rankChange !== null && rankChange !== 0 && (
          <span>
            {/* {rankChange! > 0 ? <ArrowDropDown /> : <ArrowDropUp />}{" "} */}
            {Math.abs(rankChange!)}
          </span>
        )}
      </span>

      <span className="text-base">{topItem.name}</span>
    </ListGroup.Item>
  );
};
