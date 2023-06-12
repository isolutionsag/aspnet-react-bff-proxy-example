import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { NetworkFirst } from "workbox-strategies";
import { BackgroundSyncPlugin } from "workbox-background-sync";

const wbManifestPrecacheEntries = self.__WB_MANIFEST;

// The precache entries by default include index.html (glob patterns seem to be ignored for this).
// since our request to index.html includes cookies with tokens we want to refresh as often as possible,
// we need to remove it from the precache
const wbManifestPrecacheEntriesWithoutIndexHtml =
  wbManifestPrecacheEntries.filter((entry) => entry.url !== "index.html");

precacheAndRoute(wbManifestPrecacheEntriesWithoutIndexHtml);

const bgSyncPlugin = new BackgroundSyncPlugin("myQueueName", {
  maxRetentionTime: 24 * 60, // Retry for max of 24 Hours (specified in minutes)
});

self.addEventListener("install", (event) => {
  event.waitUntil(caches.delete("v1"));
});

// Try fetching the html first, get from cache if not available
registerRoute(
  ({ request }) => {
    return request.mode === "navigate";
  },
  new NetworkFirst({
    cacheName: "v1",
    plugins: [bgSyncPlugin], // retry this request once we're back online if failed - this will make sure we refresh tokens ASAP
  })
);

// Fallback cache for assets
registerRoute(
  ({ request }) => {
    const relativePath = request.url.replace(self.location.origin, "");
    return relativePath.startsWith("/assets/");
  },
  new NetworkFirst({
    cacheName: "v1",
  })
);

// Try fetching Auth info first, get from cache if not available
registerRoute(
  ({ request }) => {
    const relativePath = request.url.replace(self.location.origin, "");
    return relativePath.startsWith("/api/Auth");
  },
  new NetworkFirst({
    cacheName: "v1",
    plugins: [bgSyncPlugin], // retry this request once we're back online if failed - this will make sure we refresh tokens ASAP
  })
);
