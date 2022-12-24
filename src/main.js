// For more information, see https://crawlee.dev/
import { CheerioCrawler, Dataset, log } from "crawlee";
import { router } from "./routes.js";

let enqueuedCount = 0;
let processedCount = 0;
let errorCount = 0;

const startUrls = [];

// Generate URLs for creator profiles
const creatorBaseURL = "https://app.hellothematic.com/creator/profile/";
const numCreatorProfiles = 100; // Number of creator profiles to generate URLs for
const creatorProfiles = []; // Array to hold the URLs

for (let i = 1; i <= numCreatorProfiles; i++) {
  const url = creatorBaseURL + i; // Construct the URL for the current creator profile
  creatorProfiles.push(url); // Add the URL to the array
}

console.log(creatorProfiles); // Output the array of URLs

// Generate URLs for artist profiles
const artistBaseURL = "https://app.hellothematic.com/artist/profile/";
const numArtistProfiles = 100; // Number of artist profiles to generate URLs for
const artistProfiles = []; // Array to hold the URLs

for (let i = 1; i <= numArtistProfiles; i++) {
  const url = artistBaseURL + i; // Construct the URL for the current artist profile
  artistProfiles.push(url); // Add the URL to the array
}

console.log(artistProfiles); // Output the array of URLs

// Combine the URLs for creator and artist profiles
const allProfiles = [...creatorProfiles, ...artistProfiles];

// Add the URLs to the startUrls array
startUrls.push(...allProfiles);

const crawler = new CheerioCrawler({
  // proxyConfiguration: new ProxyConfiguration({ proxyUrls: ['...'] }),
  requestHandler: router,
  useSessionPool: true,
});

await crawler.run(startUrls);

log.info(`Enqueued: ${enqueuedCount} URLs`);
log.info(`Processed: ${processedCount} URLs`);
log.info(`Errors: ${errorCount} URLs`);

//export the dataset to a single JSON file
