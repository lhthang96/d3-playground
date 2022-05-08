<script lang="ts">
  import SimpleLineChart from "./components/SimpleLineChart.svelte";
</script>

<main>
  <SimpleLineChart label="Line Chart" />
</main>

<style>
  main {
    padding: 1em;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
      display: flex;
      align-items: center;
    }
  }
</style>
