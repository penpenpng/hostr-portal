<script lang="ts">
  import { type PageEntry, profiles } from "../lib/store";
  import Author from "./Author.svelte";

  export let entry: PageEntry;
</script>

<main>
  <li>
    <Author profile={$profiles[entry.author]} />
    <div>
      Title: {entry.title ?? "No Title"}
    </div>
    <div>
      (d: {entry.d})
    </div>
    <a
      href={`https://h.hostr.cc/p/${entry.author}/d/${entry.d}`}
      target="_blank">Link</a
    >
  </li>
</main>
