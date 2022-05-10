<script lang="ts">
  import SimpleLineChart from "./components/SimpleLineChart.svelte";
</script>

<main>
  <div class="content">
    <SimpleLineChart styles={{ height: 300, width: 500 }} />
  </div>
  <div class="menu">
    <div class="menu-item" />
  </div>
</main>

<style>
  :global(:root) {
    --primary-color: #b87131;
    --secondary-color: #ffdbab;
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
  }
</style>
