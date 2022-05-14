<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { ChartSelectorItem } from '../../interfaces';

  export let charts: { id: string; thumbnail: string; caption: string }[] = [];
  export let selectedChartId: string;

  const dispatch = createEventDispatcher();
  const selectChart = (chart: ChartSelectorItem): any => {
    dispatch('selectChart', { chart });
  };
</script>

<section id="chart-selector">
  <div class="chart-list">
    {#each charts as chart}
      <figure class={`chart-item${selectedChartId === chart.id ? ' selected' : ''}`} on:click={selectChart(chart)}>
        <img src={chart.thumbnail} alt="Thumbnail for chart" class="chart-item-thumbnail" />
        <figcaption class="chart-item-caption">{chart.caption}</figcaption>
      </figure>
    {/each}
  </div>
</section>

<style lang="scss">
  section#chart-selector {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .chart-list {
      display: flex;
      align-items: center;
      justify-content: center;
      .chart-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        img.chart-item-thumbnail {
          width: 140px;
          height: 100px;
          margin-bottom: 16px;
        }

        &.selected,
        &:hover {
          > img.chart-item-thumbnail {
            border: 5px solid var(--third-color);
          }
          figcaption.chart-item-caption {
            color: var(--third-color);
            font-weight: 600;
          }
        }
      }
    }
  }
</style>
