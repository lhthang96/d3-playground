<script lang="ts">
  import * as d3 from 'd3';
  import dayjs from 'dayjs';
  import defaultsDeep from 'lodash.defaultsdeep';
  import type { Observable, Subscription } from 'rxjs';
  import { interval, startWith } from 'rxjs';
  import { map } from 'rxjs/operators';
  import { onDestroy, onMount } from 'svelte';
  import { DEFAULT_LINE_CHART_STYLES } from '../constants';
  import type { LineChartStyles, MockupTemperatureData, RealtimeData } from '../interfaces';
  import data from '../mockup/data.json';

  /**
   * Props
   */
  export let chartId = 'realtimeLineChart';
  export let label: string = 'Realtime Line Chart';
  export let configs: { yDelta?: number; duration?: 1000; observingTime?: number } = {
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
    map((index) => ({ value: parseFloat(data[index % data.length].temperature), time: new Date().getTime() }))
  );

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
    const { duration, observingTime, yDelta } = configs;
    const svg = d3.select(`svg#${chartId}`).attr('width', chartStyles.width).attr('height', chartStyles.height);

    const width = chartStyles.width - (padding.left + padding.right);
    const height = chartStyles.height - (padding.top - padding.bottom);
    const x = d3.scaleTime().rangeRound([0, width]);
    const y = d3.scaleLinear().rangeRound([height - padding.top, 0]);
    const line = d3
      .line<RealtimeData>()
      .curve(d3.curveBasis)
      .x((d) => x(d.time))
      .y((d) => y(d.value));

    renderXAxisSubscription = interval(duration)
      .pipe(startWith(0))
      .subscribe({
        next: (): void => {
          const tXAxis = d3.transition().duration(duration).ease(d3.easeLinear);
          const xMin = new Date().getTime() - observingTime + duration * 2;
          const xMax = new Date().getTime() - duration * 2;
          x.domain([xMin, xMax]);

          if (!svg.select('g.xAxis').node()) {
            svg.append('g').attr('class', 'xAxis').attr('transform', `translate(${padding.left}, ${height})`);
          }

          svg
            .select('g.xAxis')
            .transition(tXAxis)
            .call(d3.axisBottom(x).ticks(5) as any);
        },
      });

    renderYAxisSubscription = data$.subscribe({
      next: ({ time, value }): void => {
        lineData.push({ time, value });
        lineData = lineData.filter(({ time }) => time >= new Date().getTime() - observingTime - duration * 2);

        const tYAxis = d3.transition().duration(duration).ease(d3.easeLinear);
        const yMin = d3.min(lineData, (data) => data.value) || 0;
        const yMax = d3.max(lineData, (data) => data.value) || 0;
        y.domain([yMin - yDelta, yMax + yDelta]);

        if (!svg.select('g.yAxis').node()) {
          svg.append('g').attr('class', 'yAxis').attr('transform', `translate(${padding.left}, ${padding.top})`);
        }

        svg
          .select('g.yAxis')
          .transition(tYAxis)
          .call(d3.axisLeft(y).ticks(8) as any);

        // Line

        if (!svg.select('path.lineData').node()) {
          svg.append('path').attr('class', 'lineData');
        }

        svg
          .select('path.lineData')
          .datum(lineData)
          .transition(tYAxis)
          .attr('transform', `translate(${padding.left + padding.right}, ${padding.top})`)
          .attr('fill', 'none')
          .attr('stroke', chartStyles.color)
          .attr('stroke-width', 1)
          .attr('d', line);
      },
    });
  });

  onDestroy(() => {
    renderXAxisSubscription.unsubscribe();
    renderYAxisSubscription.unsubscribe();
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
