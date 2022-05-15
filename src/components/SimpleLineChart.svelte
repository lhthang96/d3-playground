<script lang="ts">
  import * as d3 from 'd3';
  import dayjs from 'dayjs';
  import defaultsDeep from 'lodash.defaultsdeep';
  import { onMount } from 'svelte';
  import { DEFAULT_LINE_CHART_STYLES } from '../constants';
  import type { LineChartStyles, MockupTemperatureData } from '../interfaces';
  import mockup from '../mockup/data.json';
  const data = mockup.slice(0, 30);

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
      .concat(`width: ${chartStyles.width + padding.right}px`)
      .concat(`; height: ${chartStyles.height + padding.bottom}px`)
      .concat(`; background: ${chartStyles.backgroundColor}`);

    return inlineStyles;
  };

  onMount(() => {
    const svg = d3.select(`svg#${chartId}`).attr('width', chartStyles.width).attr('height', chartStyles.height);

    const width = chartStyles.width - (padding.left + padding.right);
    const height = chartStyles.height - (padding.top + padding.bottom);

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
      .range([height, 0]);

    const xAxis = d3
      .axisBottom(xScale)
      .tickFormat((domainValue) => dayjs(domainValue.toString()).format('DD/MM'))
      .ticks(5);
    const yAxis = d3.axisLeft(yScale);

    // Axes
    svg
      .append('g')
      .attr('transform', `translate(${padding.left}, ${height + padding.top})`)
      .call(xAxis);
    svg.append('g').attr('transform', `translate(${padding.left}, ${padding.top})`).call(yAxis);

    // Line
    const line = d3
      .line<MockupTemperatureData>()
      .x((d) => xScale(new Date(d.date).getTime()))
      .y((d) => yScale(parseFloat(d.temperature) || 0));

    const g = svg
      .append('g')
      .attr('class', 'lineGroup')
      .attr('transform', `translate(${padding.left}, ${padding.top})`);

    // Draw line data
    g.append('path')
      .datum(data)
      .attr('class', 'lineData')
      .attr('fill', 'none')
      .attr('stroke', chartStyles.color)
      .attr('stroke-width', 1)
      .attr('d', line);

    /**
     * Create an overlay for displaying tooltip
     *
     * Refs: https://bl.ocks.org/Qizly/8f6ba236b79d9bb03a80
     */
    const tooltipWidth = 140;
    const tooltipHeight = 48;
    const tooltipX = 12;
    const tooltipY = -30;

    const gOverlay = g.append('g').attr('class', 'gOverlay').attr('display', 'none');
    gOverlay.append('circle').attr('r', 5).attr('fill', 'steelblue');

    const gTooltip = gOverlay.append('g').attr('class', 'gTooltip');
    gTooltip
      .append('rect')
      .attr('class', 'tooltip')
      .attr('x', tooltipX)
      .attr('y', tooltipY)
      .attr('width', tooltipWidth)
      .attr('height', tooltipHeight)
      .attr('stroke', '#212121')
      .attr('fill', '#fff')
      .attr('rx', 4)
      .attr('ry', 4);
    gTooltip.append('text').attr('class', 'tooltipDate').attr('font-size', 12).attr('x', 20).attr('y', -12);
    gTooltip.append('text').attr('class', 'tooltipValue').attr('font-size', 12).attr('x', 20).attr('y', 6);

    // Create a rectangle for moving mouse
    g.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'transparent')
      .attr('class', 'overlay')
      .on('mouseover', (): void => {
        gOverlay.attr('display', null);
      })
      .on('mouseout', (): void => {
        gOverlay.attr('display', 'none');
      })
      .on('mousemove', (e): void => {
        /**
         * Get pointer coordinates transformed using the inverse of the screen coordinate transformation matrix.
         * Refs: https://github.com/d3/d3-selection/blob/v3.0.0/README.md#pointer
         */
        const [pointerX] = d3.pointer(e, svg.node());
        const x0 = xScale.invert(pointerX - padding.left);
        const index = d3.bisector((d: MockupTemperatureData) => d.date).left(data, dayjs(x0).format('YYYY-MM-DD'), 1);
        const d0 = data[index - 1];
        const d1 = data[index];
        // Pick the nearest index to pointer
        const d =
          new Date(x0).getTime() - new Date(d0.date).getTime() > new Date(d1.date).getTime() - new Date(x0).getTime()
            ? d1
            : d0;
        const value = parseFloat(d?.temperature) || 0;

        const overlayTranslateX = xScale(new Date(d.date).getTime());
        const overlayTranslateY = yScale(value);
        gOverlay.attr('transform', `translate(${overlayTranslateX}, ${overlayTranslateY})`);

        // Calculate tooltip rectangle
        const tooltipTranslateX = width - overlayTranslateX < tooltipWidth ? -(tooltipWidth + tooltipX * 2) : 0;
        gTooltip.attr('transform', `translate(${tooltipTranslateX}, 0)`);

        // Update tooltip texts
        gTooltip.select('text.tooltipDate').text(`Date: ${dayjs(x0).format('DD/MM/YYYY')}`);
        gTooltip.select('text.tooltipValue').text(`Temperature: ${value}`);
      });
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
