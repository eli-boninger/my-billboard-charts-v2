import { Button, Typography } from "@mui/material";
import SpotifyService from "../../services/SpotifyService";
import { useLoaderData, useNavigate } from "react-router-dom";
import RankGraph from "./RankGraph";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { TimeScale } from "./TimeScale";
import { useState } from "react";
import { ChevronLeft } from "@mui/icons-material";
import StatCard from "./StatCard";

async function loader({ params }) {
  const details = await SpotifyService.instance.getTopItemDetails(params.id);
  return { details };
}

const ItemDetail = () => {
  const [scale, setScale] = useState(TimeScale.Week);
  const { details } = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const navigate = useNavigate();

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newScale: TimeScale
  ) => {
    setScale(newScale);
  };
  return (
    <div>
      <Button
        variant="text"
        startIcon={<ChevronLeft />}
        className="leading-5 mb-8"
        onClick={() => navigate(-1)}
      >
        RETURN
      </Button>
      <Typography variant="h1">{details.topItem.name}</Typography>
      <Typography variant="overline">
        {details.topItem.artists?.join(", ")}
      </Typography>
      <div className="flex flex-wrap">
        <div>
          <div className="mt-8">
            <ToggleButtonGroup
              className="h-8 bg-white"
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
          </div>

          <RankGraph ranks={details.topItem.topItemRanks ?? []} scale={scale} />
        </div>
        <div className="flex flex-wrap">
          <StatCard
            statName="Highest rank"
            value={`#${details.highestRank}`}
            additionalText={`for ${details.daysAtHighestRank} day${
              details.daysAtHighestRank !== 1 ? "s" : ""
            }`}
          />
          <StatCard
            statName="Days on chart"
            value={details.daysOnChart.toString()}
          />
          <StatCard
            statName="First day on chart"
            value={new Date(details.firstDayOnChart).toLocaleDateString()}
          />
        </div>
      </div>
    </div>
  );
};

ItemDetail.loader = loader;
export default ItemDetail;
