import { ListItem, ListItemButton, Typography } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

interface Props {
  topItem: TopItem;
  index: number;
}

export const TopItemsListItem = (props: Props) => {
  const { topItem } = props;

  const labelId = `list-item-label-${topItem.id}`;
  const rankChange = topItem.previousRank
    ? topItem.rank - topItem.previousRank
    : null;
  const ListItemContent = () => (
    <div className="flex flex-row items-center gap-4">
      <div className="flex flex-row  w-16">
        <Typography variant="h6" component="div" className="w-8">
          {topItem.rank + 1}
        </Typography>
        {rankChange !== null && rankChange !== 0 && (
          <Typography
            variant="overline"
            component="div"
            className="flex flex-row items-center"
          >
            {rankChange! > 0 ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}{" "}
            {Math.abs(rankChange!)}
          </Typography>
        )}
      </div>
      <div className="flex flex-col">
        <Typography className="text-base">{topItem.name}</Typography>
        {topItem.topItemType === "TRACK" && (
          <Typography variant="overline" className="">
            {topItem.artists!.join(", ")}
          </Typography>
        )}
      </div>
    </div>
  );

  return (
    <ListItem key={topItem.id} disablePadding>
      <ListItemButton>
        <ListItemContent />
      </ListItemButton>
    </ListItem>
  );
};
