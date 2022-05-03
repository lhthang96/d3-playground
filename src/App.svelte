<script lang="ts">
  import type { Selection } from "d3";
  import * as d3 from "d3";
  import { interval, Subscription } from "rxjs";
  import { onDestroy, onMount } from "svelte";
  import data from "./assets/data.json";
  import type { RealtimeData } from "./interfaces";

  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const width = 600;
  const height = 400;
  const duration = 1000;
  const dataLength = data.length;

  let lineData: RealtimeData[] = [];
  let subscription: Subscription;

  onMount(() => {
    d3.select("#chart").datum(lineData).call(chart);
    subscription = interval(duration).subscribe({
      next: (index) => {
        const dataIndex = index % dataLength;
        const value = parseInt(data[dataIndex].temperature) || 0;
        lineData.push({
          time: new Date().getTime(),
          value,
        });

        if (lineData.length > 30) {
          lineData.shift();
        }

        d3.select("#chart").datum(lineData).call(chart);
      },
    });
  });

  onDestroy(() => {
    subscription.unsubscribe();
  });

  const chart = (
    selection: Selection<HTMLDivElement, RealtimeData[], HTMLDivElement, any>
  ): void => {
    selection.each((data) => {
      // TODO: Remove unnecessary mapping data
      const newData = [
        {
          label: "x",
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

      // TODO: How about cannot receive data in the exact duration
      const xMin = new Date().getTime() - 30 * 1000 + duration * 2;
      const xMax = new Date().getTime() - duration * 2;
      x.domain([xMin, xMax]);

      // TODO: Can we dynamic this based on the values with a delta
      y.domain([35, 70]);

      const line = d3
        .line()
        .curve(d3.curveBasis)
        // TODO: Fix type as any is just a work around. Confirm if this is type error?
        .x((d: any) => x(d.time))
        .y((d: any) => y(d.value));

      const svg = d3.select("#chart").selectAll("svg").data([newData]);
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
        .data(newData)
        .enter()
        .append("path")
        .attr("class", "data");

      const anotherSvg = selection.select("svg");
      anotherSvg.attr("width", width).attr("height", height);

      const tick = () => {
        const pathData = d3.select("#chart").select("path.data").node();
        d3.select(pathData)
          .attr("d", (d) => {
            return line(d as [number, number][]);
          })
          .attr("transform", null);

        const xMinLess = new Date(xMin).getTime() - duration;
        d3.active(pathData)
          .attr("transform", `translate(${x(xMinLess) || 0}, 0)`)
          .transition()
          .on("start", tick);
      };

      const g = anotherSvg
        .select("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      g.select("g.axis.x")
        .attr(
          "transform",
          "translate(0," + (height - margin.bottom - margin.top) + ")"
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
        .data(newData)
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

<main>
  <div id="chart" />
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  #chart {
    width: 600px;
    height: 400px;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
