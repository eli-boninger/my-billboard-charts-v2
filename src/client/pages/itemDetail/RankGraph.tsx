import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { TimeScale } from "./TimeScale";

interface Props {
  ranks: TopItemRank[];
  scale?: TimeScale;
}

const TimeScaleToDays: { [key: string]: number } = {
  [TimeScale.Week]: 7,
  [TimeScale.Month]: 30,
  [TimeScale.Year]: 365,
  [TimeScale.AllTime]: -1,
};

const getRankByDay = (dates: Date[], ranks: TopItemRank[]) => {
  // Turn counts into an object with date key and count value
  const rankSet = ranks.reduce((acc, rank) => {
    acc[new Date(rank.createdAt).toLocaleDateString()] = rank;
    return acc;
  }, {} as { [key: string]: TopItemRank });

  // Loops through
  const dateSet = dates.map((date) => {
    const rank = rankSet[date.toLocaleDateString()];
    if (rank) {
      return {
        ...rank,
        createdAt: new Date(rank.createdAt),
      };
    } else {
      return {
        createdAt: date,
        rank: undefined,
      };
    }
  });

  return dateSet;
};

const RankGraph = (props: Props) => {
  const { ranks, scale = TimeScale.Week } = props;
  const divRef = useRef<HTMLDivElement>(null);

  const allDates = [];
  const today = new Date();
  for (let i = 0; i < TimeScaleToDays[scale]; i++) {
    const thisDate = new Date();
    thisDate.setDate(today.getDate() - i);
    allDates.unshift(thisDate);
  }
  const transformedRanks = getRankByDay(allDates, ranks).map((r) => {
    const normalizedDate = new Date(r.createdAt);
    normalizedDate.setHours(0, 0, 0, 0);
    const fixedRank = r.rank !== undefined ? r.rank + 1 : undefined;
    return {
      rank: fixedRank,
      createdAt: normalizedDate,
    };
  });

  useEffect(() => {
    if (transformedRanks === undefined) return;

    const earliestDate = new Date();
    earliestDate.setDate(earliestDate.getDate() - TimeScaleToDays[scale]);
    earliestDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const plot = Plot.plot({
      x: {
        domain: [earliestDate, today],
        ticks: TimeScaleToDays[scale],
        type: "time",
        label: "Date",
        labelAnchor: "center",
        labelArrow: "none",
      },
      y: {
        grid: true,
        label: "Chart position",
        domain: [20, 1],
        ticks: 20,
        labelArrow: "up",
      },
      color: { scheme: "burd" },
      marks: [
        Plot.lineY(transformedRanks, {
          x: "createdAt",
          y: "rank",
          marker: "circle-stroke",
          stroke: "steelblue",
        }),
        Plot.ruleX([earliestDate]),
        Plot.ruleY([20]),
      ],
    });
    divRef.current?.append(plot);
    return () => plot.remove();
  }, [transformedRanks]);

  return <div ref={divRef} />;
};

export default RankGraph;
