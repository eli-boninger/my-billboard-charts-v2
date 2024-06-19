import { Typography } from "@mui/material";
import SpotifyService from "../../services/SpotifyService";
import { useLoaderData } from "react-router-dom";
import RankGraph from "./RankGraph";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { TimeScale } from "./TimeScale";
import { useState } from "react";

async function loader({ params }) {
  const details = await SpotifyService.instance.getTopItemDetails(params.id);
  return { details };
}

const ItemDetail = () => {
  const [scale, setScale] = useState(TimeScale.Week);
  const { details } = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newScale: TimeScale
  ) => {
    setScale(newScale);
  };
  return (
    <div>
      <Typography variant="h1">{details.topItem.name}</Typography>
      <ToggleButtonGroup
        color="primary"
        value={scale}
        exclusive
        onChange={handleChange}
        aria-label="Platform"
      >
        <ToggleButton value={TimeScale.Week}>Week</ToggleButton>
        <ToggleButton value={TimeScale.Month}>Month</ToggleButton>
        <ToggleButton value={TimeScale.Year}>Year</ToggleButton>
        <ToggleButton value={TimeScale.AllTime}>All Time</ToggleButton>
      </ToggleButtonGroup>
      <RankGraph ranks={details.topItem.topItemRanks ?? []} scale={scale} />
      <Typography>{`Highest rank: ${details.highestRank}`}</Typography>
      <Typography>{`Days at number ${details.highestRank}: ${details.daysAtHighestRank}`}</Typography>
      <Typography>{`Days on chart: ${details.daysOnChart}`}</Typography>
      <Typography>{`First day on chart: ${new Date(
        details.firstDayOnChart
      ).toLocaleDateString()}`}</Typography>
    </div>
  );
};

ItemDetail.loader = loader;
export default ItemDetail;
