<script lang="ts">
  import type { Selection } from "d3";
  import * as d3 from "d3";
  import { interval, Subscription } from "rxjs";
  import { onDestroy, onMount } from "svelte";
  import data from "../mockup/data.json";
  import type { D3Data, RealtimeData } from "../interfaces";

  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const width = 600;
  const height = 400;
  const duration = 1000;
  const dataLength = data.length;
  const observingTime = 30 * 1000; // 30s
  const yDelta = 10;

  let lineData: RealtimeData[] = [];
  let renderSubscription: Subscription;
  let dataSubscription: Subscription;

  onMount(() => {
    renderSubscription = interval(duration).subscribe({
      next: () => {
        d3.select("#custom-chart").datum(lineData).call(chart);
      },
    });

    dataSubscription = interval(duration).subscribe({
      next: (index) => {
        if (index % 4 === 1) {
          lineData.push({
            time: new Date().getTime(),
            value: undefined,
          });

          lineData = lineData.filter(
            (data) => data.time >= new Date().getTime() - observingTime
          );
          return;
        }

        const dataIndex = index % dataLength;

        const value = parseInt(data[dataIndex].temperature) || 0;
        lineData.push({
          time: new Date().getTime(),
          value,
        });

        lineData = lineData.filter(
          (data) => data.time >= new Date().getTime() - observingTime
        );
      },
    });
  });

  onDestroy(() => {
    renderSubscription.unsubscribe();
    dataSubscription.unsubscribe();
  });

  const chart = (
    selection: Selection<HTMLDivElement, RealtimeData[], HTMLDivElement, any>
  ): void => {
    selection.each((data) => {
      const d3Data: D3Data<RealtimeData>[] = [
        {
          label: "Temperature",
          values: data,
        },
      ];
      const t = d3.transition().duration(duration).ease(d3.easeLinear);
      const x = d3
        .scaleTime()
        .rangeRound([0, width - margin.left - margin.right]);
      const y = d3
        .scaleLinear()
        .rangeRound([height - margin.top - margin.bottom, 0]);

      // Show data in a delay of 2 times of duration for running transition
      const xMin = new Date().getTime() - observingTime + duration * 2;
      const xMax = new Date().getTime() - duration * 2;
      x.domain([xMin, xMax]);

      const yMin =
        d3.min(d3Data, (dataItem) => {
          return d3.min(dataItem.values, (value) => value.value);
        }) || 0;
      const yMax =
        d3.max(d3Data, (dataItem) => {
          return d3.max(dataItem.values, (value) => value.value);
        }) || 0;
      y.domain([yMin - yDelta, yMax + yDelta]);

      const line = d3
        .line<RealtimeData>()
        .curve(d3.curveBasis)
        .x((d) => x(d.time))
        .y((d) => y(d.value))
        .defined((d) => d.value !== undefined);

      const tick = (): void => {
        const pathData = d3.select("#custom-chart").select("path.data").node();
        d3.select(pathData)
          .attr("d", (d: RealtimeData[]) => line(d))
          .attr("transform", null);

        const xMinLess = new Date(xMin).getTime() - duration;
        d3.active(pathData)
          .attr("transform", `translate(${x(xMinLess) || 0}, 0)`)
          .transition()
          .on("start", tick);
      };

      const svg = d3.select("#custom-chart").selectAll("svg").data([d3Data]);
      const gEnter = svg.enter().append("svg").append("g");
      gEnter.append("g").attr("class", "axis x");
      gEnter.append("g").attr("class", "axis y");
      gEnter
        .append("defs")
        .append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width - margin.left - margin.right)
        .attr("height", height - margin.top - margin.bottom);
      gEnter
        .append("g")
        .attr("class", "lines")
        .attr("clip-path", "url(#clip)")
        .selectAll(".data")
        .data(d3Data)
        .enter()
        .append("path")
        .attr("class", "data");

      const anotherSvg = selection.select("svg");
      anotherSvg.attr("width", width).attr("height", height);

      const g = anotherSvg
        .select("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

      g.select("g.axis.x")
        .attr(
          "transform",
          `translate(0, ${height - margin.bottom - margin.top})`
        )
        .transition(t)
        .call(d3.axisBottom(x).ticks(5) as any);
      g.select("g.axis.y")
        .transition(t)
        .attr("class", "axis y")
        .call(d3.axisLeft(y) as any);

      g.select("defs clipPath rect")
        .transition(t)
        .attr("width", width - margin.left - margin.right)
        .attr("height", height - margin.top - margin.right);

      g.selectAll("g path.data")
        .data(d3Data)
        .style("stroke", "steelblue")
        .style("stroke-width", 1)
        .style("fill", "none")
        .transition()
        .duration(duration)
        .ease(d3.easeLinear)
        .on("start", tick);
    });
  };
</script>

<div class="chart-container">
  <div id="custom-chart" />
</div>

<style>
  .chart-container {
    text-align: center;
    padding: 16px;
  }

  #custom-chart {
    width: 600px;
    height: 400px;
  }
</style>
