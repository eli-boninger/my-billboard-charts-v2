import { Button, Typography } from "@mui/material";
import SpotifyService from "../../services/SpotifyService";
import { useNavigate, useParams } from "react-router-dom";
import RankGraph from "./RankGraph";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { TimeScale } from "./TimeScale";
import { useContext, useEffect, useState } from "react";
import { ChevronLeft } from "@mui/icons-material";
import StatCard from "./StatCard";
import { UserContext } from "../../context/UserContext";

const ItemDetail = () => {
  const { id } = useParams();
  const [scale, setScale] = useState(TimeScale.Week);
  const user = useContext(UserContext);
  const [details, setDetails] = useState<TopItemDetails | undefined>();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDetails() {
      const res = await SpotifyService.instance.getTopItemDetails(id!, user!);
      setDetails(res);
    }
    if (user && id) {
      fetchDetails();
    }
  }, [user]);

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newScale: TimeScale
  ) => {
    setScale(newScale);
  };
  if (!details) return <div>loading...</div>;
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

export default ItemDetail;
