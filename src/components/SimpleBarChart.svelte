<script lang="ts">
  import * as d3 from "d3";
  import { onMount } from "svelte";
  import { generateDataset } from "../utils";
  export let chartId = "simpleBarChart";
  export let label: string = "Simple Bar Chart";
  export let data: number[] = generateDataset();
  export let configs: {
    yMin: number;
    yMax: number;
  } = {
    yMin: 0,
    yMax: 9,
  };
  export let styles: {
    width: number;
    height: number;
    barPadding: number;
  } = {
    width: 500,
    height: 300,
    barPadding: 5,
  };

  const padding = {
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

    const width = styles.width - (padding.left + padding.right);
    const height = styles.height - (padding.top - padding.bottom);
    const barWidth = width / data.length;

    const xScale = d3
      .scaleBand()
      .domain(data.map((_, index) => `${index}`))
      .range([0, width]);
    const yScale = d3
      .scaleLinear()
      .domain([configs.yMin, configs.yMax])
      .range([height - 40, 0]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    // Axes
    svg
      .append("g")
      // .attr("transform", `translate(${padding.left}, ${padding.bottom})`)
      .attr("transform", `translate(${padding.left}, ${padding.top})`)
      .call(yAxis);
    svg
      .append("g")
      .attr("transform", `translate(${padding.left}, ${height})`)
      .call(xAxis);

    // Bars
    svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("y", (d) => height - yScale(d))
      .attr("height", (d) => yScale(d))
      .attr("width", barWidth - styles.barPadding)
      .attr(
        "transform",
        (_, i) =>
          `translate(${barWidth * i + padding.left + styles.barPadding / 2}, 0)`
      )
      .attr("fill", "steelblue");
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
