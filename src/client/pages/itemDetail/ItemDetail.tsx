import { Typography } from "@mui/material";
import SpotifyService from "../../services/SpotifyService";
import { useLoaderData } from "react-router-dom";
import RankGraph from "./RankGraph";

async function loader({ params }) {
  const details = await SpotifyService.instance.getTopItemDetails(params.id);
  return { details };
}

const ItemDetail = () => {
  const { details } = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  return (
    <div>
      <Typography variant="h1">{details.topItem.name}</Typography>
      <RankGraph ranks={details.topItem.topItemRanks ?? []} />
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
