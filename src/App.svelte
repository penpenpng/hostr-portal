<script lang="ts">
  import Link from "./components/Link.svelte";
  import { pageEntries, profiles, setupStores } from "./lib/store";

  setupStores();
</script>

<main>
  <ul>
    {#each $pageEntries as entry (entry.id)}
      <Link {entry} />
    {/each}
  </ul>
</main>
