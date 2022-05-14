<script lang="ts">
  import * as d3 from 'd3';
  import defaultsDeep from 'lodash.defaultsdeep';
  import { onMount } from 'svelte';
  import { DEFAULT_BAR_CHART_STYLES } from '../constants';
  import type { BarChartStyles } from '../interfaces';
  import { generateDataset } from '../utils';

  /**
   * Props
   */
  export let chartId = 'simpleBarChart';
  export let label: string = 'Simple Bar Chart';
  export let data: number[] = generateDataset();
  export let configs: { yMin: number; yMax: number } = { yMin: 0, yMax: 9 };
  export let styles: BarChartStyles = {};

  /**
   * Compute
   */
  $: chartStyles = defaultsDeep(styles, DEFAULT_BAR_CHART_STYLES) as BarChartStyles;
  $: padding = chartStyles.containerPadding;
  $: getContainerStyles = () => {
    let inlineStyles = '';
    inlineStyles = inlineStyles
      .concat(`width: ${chartStyles.width + padding.bottom}px`)
      .concat(`; height: ${chartStyles.height + padding.right}px`)
      .concat(`; background: ${chartStyles.backgroundColor}`);

    return inlineStyles;
  };

  onMount(() => {
    const svg = d3.select(`svg#${chartId}`).attr('width', chartStyles.width).attr('height', chartStyles.height);

    const width = chartStyles.width - (padding.left + padding.right);
    const height = chartStyles.height - (padding.top - padding.bottom);
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
    svg.append('g').attr('transform', `translate(${padding.left}, ${height})`).call(xAxis);
    svg.append('g').attr('transform', `translate(${padding.left}, ${padding.top})`).call(yAxis);

    // Bars
    svg
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('y', (d) => height - yScale(d))
      .attr('height', (d) => yScale(d))
      .attr('width', barWidth - chartStyles.barPadding)
      .attr('transform', (_, i) => `translate(${barWidth * i + padding.left + chartStyles.barPadding / 2}, 0)`)
      .attr('fill', chartStyles.color);
  });
</script>

<section class="chart-section">
  <h3>{label}</h3>
  <div class="chart-container" style={getContainerStyles()}>
    <svg id={chartId} />
  </div>
</section>

<style>
  section.chart-section {
    padding: 8px 12px;
  }

  .chart-container {
    box-shadow: inset 0 0 4px 1px rgba(0, 0, 0, 0.2);
  }
</style>
