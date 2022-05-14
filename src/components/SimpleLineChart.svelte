<script lang="ts">
  import * as d3 from 'd3';
  import dayjs from 'dayjs';
  import defaultsDeep from 'lodash.defaultsdeep';
  import { onMount } from 'svelte';
  import { DEFAULT_LINE_CHART_STYLES } from '../constants';
  import type { LineChartStyles, MockupTemperatureData } from '../interfaces';
  import data from '../mockup/data.json';

  /**
   * Props
   */
  export let chartId = 'simpleLineChart';
  export let label: string = 'Simple Line Chart';
  export let configs: { yDelta: number } = { yDelta: 5 };
  export let styles: LineChartStyles = {};

  /**
   * Compute
   */
  $: chartStyles = defaultsDeep(styles, DEFAULT_LINE_CHART_STYLES) as LineChartStyles;
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

    const xScale = d3
      .scaleTime()
      .domain([d3.min(data, (d) => new Date(d.date).getTime()), d3.max(data, (d) => new Date(d.date).getTime())])
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => parseFloat(d.temperature) || 0) - configs.yDelta,
        d3.max(data, (d) => parseFloat(d.temperature) || 0) + configs.yDelta,
      ])
      .range([height - padding.top, 0]);

    const xAxis = d3.axisBottom(xScale).tickFormat((domainValue) => dayjs(domainValue.toString()).format('MM/YY'));
    const yAxis = d3.axisLeft(yScale);

    // Axes
    svg.append('g').attr('transform', `translate(${padding.left}, ${height})`).call(xAxis);
    svg.append('g').attr('transform', `translate(${padding.left}, ${padding.top})`).call(yAxis);

    // Line
    const line = d3
      .line<MockupTemperatureData>()
      .x((d) => xScale(new Date(d.date).getTime()))
      .y((d) => yScale(parseFloat(d.temperature) || 0));

    svg
      .append('path')
      .datum(data)
      .attr('transform', `translate(${padding.left}, ${padding.top})`)
      .attr('fill', 'none')
      .attr('stroke', chartStyles.color)
      .attr('stroke-width', 1)
      .attr('d', line);
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
