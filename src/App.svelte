<script lang="ts">
  import SimpleLineChart from './components/SimpleLineChart.svelte';
  import SimpleBarChart from './components/SimpleBarChart.svelte';
  import ChartSelector from './components/common/ChartSelector.svelte';
  import { CHART_SELECTOR_ITEMS } from './constants';
  import type { ChartSelectorItem } from './interfaces';

  let selectedChartId: string;

  const selectChart = (event: CustomEvent<{ chart: ChartSelectorItem }>): void => {
    const { chart } = event.detail || {};
    selectedChartId = chart?.id;
  };
</script>

<main>
  <div class="content">
    {#if selectedChartId === 'simple-line-chart'}
      <SimpleLineChart />
    {/if}
    {#if selectedChartId === 'simple-bar-chart'}
      <SimpleBarChart />
    {/if}
  </div>
  <div class="menu">
    <ChartSelector charts={CHART_SELECTOR_ITEMS} bind:selectedChartId on:selectChart={selectChart} />
  </div>
</main>

<style>
  :global(:root) {
    --primary-color: #b87131;
    --secondary-color: #ffdbab;
    --third-color: #dca913;
    --background-color: #fdfcdb;
    --text-color: #3c3d1b;
  }
  main {
    width: 100%;
    height: 100vh;
    background: var(--secondary-color);
    display: flex;
    flex-direction: column;
    color: var(--text-color);
  }

  div.content {
    flex: 1;
    overflow: hidden auto;
  }

  div.menu {
    width: 100%;
    height: 200px;
    background: var(--primary-color);
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
