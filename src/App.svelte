<script lang="ts">
  import SimpleBarChart from "./components/SimpleBarChart.svelte";
</script>

<main>
  <SimpleBarChart label="Bar Chart" />
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
