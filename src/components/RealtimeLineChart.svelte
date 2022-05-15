<script lang="ts">
  /**
   * Reference: The Path Transitions tutorial by Mike Bostock on https://bl.ocks.org community
   * Part 1: https://bl.ocks.org/mbostock/1643051
   * Part 2: https://bl.ocks.org/mbostock/1642874
   * Part 3: https://bl.ocks.org/mbostock/1642989
   */

  import * as d3 from 'd3';
  import defaultsDeep from 'lodash.defaultsdeep';
  import type { Observable, Subscription } from 'rxjs';
  import { interval, startWith } from 'rxjs';
  import { map } from 'rxjs/operators';
  import { onDestroy, onMount } from 'svelte';
  import { DEFAULT_LINE_CHART_STYLES } from '../constants';
  import type { LineChartStyles, RealtimeData } from '../interfaces';
  import data from '../mockup/data.json';

  /**
   * Props
   */
  export let chartId = 'realtimeLineChart';
  export let label: string = 'Realtime Line Chart';
  export let configs: { yDelta?: number; duration?: number; observingTime?: number } = {
    yDelta: 5,
    duration: 1000,
    observingTime: 30 * 1000,
  };
  export let styles: LineChartStyles = {};

  let lineData: RealtimeData[] = [];
  let renderXAxisSubscription: Subscription;
  let renderYAxisSubscription: Subscription;
  let data$: Observable<{ time: number; value: number }> = interval(configs.duration).pipe(
    startWith(0),
    map((index) => {
      // const shouldEmitNewValue = Math.random() > 0.3;
      // const value = shouldEmitNewValue ? parseFloat(data[index % data.length].temperature) : undefined;
      const value = parseFloat(data[index % data.length].temperature);
      const time = new Date().getTime();
      return { value, time };
    })
  );

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
    const { duration, observingTime, yDelta } = configs;
    const { width: svgWidth, height: svgHeight } = chartStyles;
    const svg = d3.select(`svg#${chartId}`).attr('width', svgWidth).attr('height', svgHeight);
    const drawWidth = chartStyles.width - (padding.left + padding.right);
    const drawHeight = chartStyles.height - (padding.top + padding.bottom);

    /**
     * Create svg components
     */

    // x axis
    svg
      .append('g')
      .attr('class', 'xAxis')
      .attr('transform', `translate(${padding.left}, ${drawHeight + padding.top})`);

    // y axis
    svg.append('g').attr('class', 'yAxis').attr('transform', `translate(${padding.left}, ${padding.top})`);

    // Group for drawing line
    const g = svg
      .append('g')
      .attr('class', 'lineGroup')
      .attr('transform', `translate(${padding.left}, ${padding.top})`);

    // Refs: https://bl.ocks.org/mbostock/1642989
    g.append('defs')
      .append('clipPath')
      .attr('id', 'lineClip')
      .append('rect')
      .attr('width', drawWidth)
      .attr('height', drawHeight);
    g.append('g').attr('clip-path', 'url(#lineClip)').append('path').attr('class', 'lineData');

    /**
     * Define chart configurations
     */
    const x = d3.scaleTime().rangeRound([0, drawWidth]);
    const y = d3.scaleLinear().rangeRound([drawHeight, 0]);
    const line = d3
      .line<RealtimeData>()
      .curve(d3.curveBasis)
      .x((d) => x(d.time))
      .y((d) => y(d.value))
      .defined((d) => typeof d.value === 'number');

    let xMin: number;
    let xMax: number;
    let yMin: number;
    let yMax: number;

    // Refs: https://bl.ocks.org/mbostock/1642874
    const tick = (): void => {
      const pathDataNode = svg.select('path.lineData').node();

      // Redraw the line
      d3.select(pathDataNode).attr('d', line).attr('transform', null);

      // Slide it to the left
      d3.active(pathDataNode)
        .attr('transform', `translate(${x(new Date(xMin).getTime() - duration)}, 0)`)
        .transition()
        .on('start', tick);
    };

    renderXAxisSubscription = interval(duration)
      .pipe(startWith(0))
      .subscribe({
        next: (): void => {
          const t = d3.transition().duration(duration).ease(d3.easeLinear);
          const now = new Date().getTime();
          xMin = now - observingTime + duration * 2;
          xMax = now - duration * 2;
          x.domain([xMin, xMax]);

          svg
            .select('g.xAxis')
            .transition(t)
            .call(d3.axisBottom(x).ticks(5) as any);
        },
      });

    renderYAxisSubscription = data$.subscribe({
      next: ({ time, value }): void => {
        const t = d3.transition().duration(duration).ease(d3.easeLinear);
        yMin = d3.min([yMin, d3.min(lineData, (data) => data.value)]);
        yMax = d3.max([yMax, d3.max(lineData, (data) => data.value)]);
        y.domain([yMin ? yMin - yDelta : 0, yMax ? yMax + yDelta : 0]);

        svg
          .select('g.yAxis')
          .transition(t)
          .call(d3.axisLeft(y).ticks(8) as any);

        // Line
        lineData.push({ time, value });
        /**
         * Why xMin - duration * 2?
         *
         * This is for a smooth transition, this make sure the actual path is longer than the visible path (the path displaying
         * on the UI, the result of the clip-path attribute we defined above). We can make the path longer and longer by storing
         * more path data, but 2 more points are good enough.
         */
        lineData = lineData.filter(({ time }) => time >= xMin - duration * 2 && time <= xMin + observingTime);
        svg
          .select('path.lineData')
          .datum(lineData)
          .attr('fill', 'none')
          .attr('stroke', chartStyles.color)
          .attr('stroke-width', 1)
          .transition()
          .duration(duration)
          .ease(d3.easeLinear)
          .on('start', tick);
      },
    });
  });

  onDestroy(() => {
    renderXAxisSubscription?.unsubscribe?.();
    renderYAxisSubscription?.unsubscribe?.();
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
