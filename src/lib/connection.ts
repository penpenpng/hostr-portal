import { from, map, bufferTime, type Observable } from "rxjs";
import {
  createRxNostr,
  type EventPacket,
  createRxBackwardReq,
  batch,
} from "rx-nostr";
import { NostrFetcher, type FetchFilter } from "nostr-fetch";
import { rxNostrAdapter } from "@nostr-fetch/adapter-rx-nostr";

import { hostrRelays, profileRelays } from "./config";

const rxNostrForHostr = createRxNostr();
await rxNostrForHostr.switchRelays(hostrRelays);
const fetcher = NostrFetcher.withCustomPool(rxNostrAdapter(rxNostrForHostr));

export { fetcher };

const rxNostr = createRxNostr();
const kind0Req = createRxBackwardReq();
await rxNostr.switchRelays(profileRelays);
const kind0$ = rxNostr.use(kind0Req);

export { kind0$, kind0Req };

export async function fetchLatestEvents(
  filter: FetchFilter,
  limit: number
): Promise<Observable<EventPacket>> {
  const events = await fetcher.fetchLatestEvents(hostrRelays, filter, limit);

  return from(events).pipe(
    map((ev) => ({
      from: "",
      subId: "",
      event: ev,
    }))
  );
}
