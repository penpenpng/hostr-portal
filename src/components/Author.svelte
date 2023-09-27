<script lang="ts">
  import { type Profile } from "../lib/store";

  export let profile: Profile | undefined;
</script>

<main>
  <div>
    Author: {profile?.name ?? profile?.displayName ?? "Anonymous"}
  </div>
</main>
