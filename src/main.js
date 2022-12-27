// For more information, see https://crawlee.dev/
import { CheerioCrawler, ProxyConfiguration, log, Dataset } from "crawlee";
import { router } from "./routes.js";

//https://app.hellothematic.com/creator/profile/1 then 2 then 3 until you hit half a million. create the url with a for loop and then push it to the array of startUrls

const startUrls = ["https://app.hellothematic.com/discover"];

const crawler = new CheerioCrawler({
  // proxyConfiguration: new ProxyConfiguration({ proxyUrls: ['...'] }),
  requestHandler: router,
  useSessionPool: true,
});

await crawler.run(startUrls);
//combine all the data into one array and then save it to a json file
const data = await Dataset.getData();
await Apify.setValue("OUTPUT", data);
