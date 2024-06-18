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
    const fixedRank = r.rank ? r.rank + 1 : undefined;
    return {
      rank: fixedRank,
      createdAt: normalizedDate,
    };
  });
  console.log(transformedRanks);

  //   const makeChart = () => {
  //     // Specify the chart’s dimensions.
  //     // Declare the chart dimensions and margins.
  //     const width = 928;
  //     const height = 500;
  //     const marginTop = 20;
  //     const marginRight = 30;
  //     const marginBottom = 30;
  //     const marginLeft = 40;

  //     const earliestDate = new Date();
  //     earliestDate.setDate(earliestDate.getDate() - TimeScaleToDays[scale]);
  //     // Declare the x (horizontal position) scale.
  //     const x = d3.scaleTime(
  //       [earliestDate, new Date()],
  //       [marginLeft, width - marginRight]
  //     );

  //     // Declare the y (vertical position) scale.
  //     const y = d3.scaleLinear([20, 1], [height - marginBottom, marginTop]);

  //     // Declare the line generator.
  //     const line = d3
  //       .line()
  //       .defined((d) => !!d.rank)
  //       .x((d) => x(d.createdAt.setHours(0, 0, 0, 0)))
  //       .y((d) => y(d.rank + 1));

  //     // Create the SVG container.
  //     const svg = d3
  //       .create("svg")
  //       .attr("width", width)
  //       .attr("height", height)
  //       .attr("viewBox", [0, 0, width, height])
  //       .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  //     // Add the x-axis.
  //     svg
  //       .append("g")
  //       .attr("transform", `translate(0,${height - marginBottom})`)
  //       .call(d3.axisBottom(x).ticks(TimeScaleToDays[scale]));

  //     // Add the y-axis, remove the domain line, add grid lines and a label.
  //     svg
  //       .append("g")
  //       .attr("transform", `translate(${marginLeft},0)`)
  //       .call(d3.axisLeft(y).ticks(20))
  //       .call((g) => g.select(".domain").remove())
  //       .call((g) =>
  //         g
  //           .selectAll(".tick line")
  //           .clone()
  //           .attr("x2", width - marginLeft - marginRight)
  //           .attr("stroke-opacity", 0.1)
  //       )
  //       .call((g) =>
  //         g
  //           .append("text")
  //           .attr("x", -marginLeft)
  //           .attr("y", 10)
  //           .attr("fill", "currentColor")
  //           .attr("text-anchor", "start")
  //           .text("↑ Rank")
  //       );

  //     // Append a path for the line.
  //     svg
  //       .append("path")
  //       .attr("fill", "none")
  //       .attr("stroke", "steelblue")
  //       .attr("stroke-width", 1.5)
  //       .attr("d", line(transformedRanks));
  //     return svg.node();
  //   };

  useEffect(() => {
    if (transformedRanks === undefined) return;

    const earliestDate = new Date();
    earliestDate.setDate(earliestDate.getDate() - TimeScaleToDays[scale]);
    earliestDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const plot = Plot.plot({
      x: { domain: [earliestDate, today] },
      y: { grid: true, label: "Chart position", domain: [20, 1] },
      color: { scheme: "burd" },
      marks: [
        Plot.lineY(transformedRanks, {
          x: "createdAt",
          y: "rank",
          marker: "circle",
          stroke: "steelblue",
        }),
        // Plot.dot(transformedRanks, { x: "createdAt", y: "rank" }),
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
