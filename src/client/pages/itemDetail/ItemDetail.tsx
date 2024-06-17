import { Typography } from "@mui/material";
import SpotifyService from "../../services/SpotifyService";
import { useLoaderData } from "react-router-dom";

async function loader({ params }) {
  const details = await SpotifyService.instance.getTopItemDetails(params.id);
  return { details };
}

const ItemDetail = () => {
  const { details } = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  return (
    <div>
      <Typography>{`Highest rank: ${details.highestRank}`}</Typography>
      <Typography>{`Days at number ${details.highestRank}: ${details.daysAtHighestRank}`}</Typography>
      <Typography>{`Days on chart: ${details.daysOnChart}`}</Typography>
      <Typography>{`First day on chart: ${details.firstDayOnChart}`}</Typography>
    </div>
  );
};

ItemDetail.loader = loader;
export default ItemDetail;
