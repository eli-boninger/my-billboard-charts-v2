import { Card, CardContent, Typography } from "@mui/material";

interface Props {
  statName: string;
  value: string;
  additionalText?: string;
}

const StatCard = (props: Props) => {
  const { statName, value, additionalText } = props;
  return (
    <Card className="max-w-40 m-4 max-h-40">
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {statName}
        </Typography>
        <Typography variant="h5" component="div">
          {value}
        </Typography>
        {additionalText && (
          <Typography variant="body2">{additionalText}</Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
