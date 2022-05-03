<script lang="ts">
  import OriginalRealtimeLineChart from "./components/OriginalRealtimeLineChart.svelte";
</script>

<main>
  <OriginalRealtimeLineChart />
</main>

<style>
  main {
    padding: 1em;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
