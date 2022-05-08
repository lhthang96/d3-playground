<script lang="ts">
  import * as d3 from "d3";
  import dayjs from "dayjs";
  import data from "../mockup/data.json";
  import { onMount } from "svelte";
  import type { MockupTemperatureData } from "../interfaces";
  export let chartId = "simpleLineChart";
  export let label: string = "Simple Line Chart";
  export let configs: { yDelta: number } = { yDelta: 5 };
  export let styles: {
    width: number;
    height: number;
  } = {
    width: 500,
    height: 300,
  };

  const margin = {
    top: 40,
    bottom: 20,
    left: 50,
    right: 20,
  };

  onMount(() => {
    const svg = d3
      .select(`svg#${chartId}`)
      .attr("width", styles.width)
      .attr("height", styles.height);

    const width = styles.width - (margin.left + margin.right);
    const height = styles.height - (margin.top - margin.bottom);

    const xScale = d3
      .scaleTime()
      .domain([
        d3.min(data, (d) => new Date(d.date).getTime()),
        d3.max(data, (d) => new Date(d.date).getTime()),
      ])
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => parseFloat(d.temperature) || 0) - configs.yDelta,
        d3.max(data, (d) => parseFloat(d.temperature) || 0) + configs.yDelta,
      ])
      .range([height - 40, 0]);

    const xAxis = d3
      .axisBottom(xScale)
      .tickFormat((domainValue) =>
        dayjs(domainValue.toString()).format("MM/YY")
      );
    const yAxis = d3.axisLeft(yScale);

    // Axes
    svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${height})`)
      .call(xAxis);
    svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .call(yAxis);

    // Line
    const line = d3
      .line<MockupTemperatureData>()
      .x((d) => xScale(new Date(d.date).getTime()))
      .y((d) => yScale(parseFloat(d.temperature) || 0));

    svg
      .append("path")
      .datum(data)
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1)
      .attr("d", line);
  });
</script>

<section class="chart-section">
  <h3>{label}</h3>
  <div class="chart-container">
    <svg id={chartId} />
  </div>
</section>

<style>
  section.chart-section {
    padding: 8px 12px;
  }

  .chart-container {
    background: rgb(214, 235, 214);
  }
</style>
