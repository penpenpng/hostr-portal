import { filter, map, scan, tap, BehaviorSubject } from "rxjs";
import { latestEach } from "rx-nostr";
import type * as Nostr from "nostr-typedef";

import { fetchLatestEvents, kind0Req, kind0$ } from "./connection";
import { getTagValue, toDate } from "./nostr";

export const pageEntries = new BehaviorSubject<PageEntriesStore>([]);
export const profiles = new BehaviorSubject<ProfilesStore>({});

export async function setupStores() {
  kind0$
    .pipe(
      latestEach(({ event }) => event.pubkey),
      map(({ event }) => toProfile(event)),
      scan<Profile, ProfilesStore>(updateProfilesStore, {})
    )
    .subscribe(profiles);

  (await fetchLatestEvents({ kinds: [35392] }, 30))
    .pipe(
      filter(({ event }) => !!getTagValue("d", event.tags)),
      latestEach(({ event }) => getTagValue("d", event.tags)),
      tap(({ event }) => reqKind0(event)),
      map(({ event }) => toPageEntry(event)),
      scan<PageEntry, PageEntriesStore>(updatePageEntriesStore, [])
    )
    .subscribe(pageEntries);
}

function updatePageEntriesStore(
  store: PageEntriesStore,
  entry: PageEntry
): PageEntriesStore {
  const idx = store.findIndex(
    ({ author, d }) => entry.author === author && entry.d === d
  );

  if (idx < 0) {
    return [...store, entry];
  } else {
    return [...store.slice(0, idx), entry, ...store.slice(idx + 1)];
  }
}
function updateProfilesStore(
  store: ProfilesStore,
  entry: Profile
): ProfilesStore {
  return {
    ...store,
    entry,
  };
}

const parser = new DOMParser();
function toPageEntry(event: Nostr.Event): PageEntry {
  return {
    id: event.id,
    author: event.pubkey,
    createdAt: toDate(event.created_at),
    d: getTagValue("d", event.tags) ?? "",
    title:
      parser.parseFromString(event.content, "text/html").title || undefined,
  };
}
function toProfile(event: Nostr.Event): Profile {
  const profile = parseKind0(event.content);

  return {
    name: profile.name,
    displayName: profile.display_name ?? profile.displayName,
    avatar: profile.picture,
    pubkey: event.pubkey,
  };
}
function reqKind0(event: Nostr.Event): void {
  kind0Req.emit({ kinds: [0], authors: [event.pubkey], limit: 1 });
}
function parseKind0(content: string): any {
  try {
    return JSON.parse(content);
  } catch {
    return {};
  }
}

export type PageEntriesStore = PageEntry[];
export interface ProfilesStore {
  [pubkey: string]: Profile;
}

export interface PageEntry {
  id: string;
  author: string;
  createdAt: Date;
  d: string;
  title?: string;
}

export interface Profile {
  name?: string; //
  displayName?: string; // display_name ?? displayName
  avatar?: string; // picture
  pubkey: string;
}
