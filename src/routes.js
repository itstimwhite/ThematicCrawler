import { Dataset, createCheerioRouter, utils } from "crawlee";

export const router = createCheerioRouter();

let enqueuedCount = 0;
let processedCount = 0;
let errorCount = 0;

router.addDefaultHandler(async ({ enqueueLinks, log }) => {
  const currentTime = new Date().toString();
  log.info(`[${currentTime}] enqueueing new URLs`);
  await enqueueLinks({
    globs: ["https://app.hellothematic.com/artist/profile/**"],
    label: "artist",
  });
  await enqueueLinks({
    globs: ["https://app.hellothematic.com/creator/profile/**"],
    label: "creator",
  });
  enqueuedCount += 1;
});

router.addHandler("artist", async ({ request, $, log }) => {
  const currentTime = new Date().toString();
  try {
    const title = $("title").text();
    log.info(`[${currentTime}] ${title} - ${request.loadedUrl}`);
    const name = $("div.name-wrapper h1").text();
    const imgSrc = $("img.profile-image-round").attr("src");
    const bio = $(".person-description").text();
    const socialLinks = utils.social.parseHandlesFromHtml($("ul.social-media-links").html());
    const profileType = "artist";

    await Dataset.pushData({
      url: request.loadedUrl,
      title,
      name,
      bio,
      imgSrc,
      socialLinks,
      profileType,
    });
    processedCount += 1;
  } catch (error) {
    log.error(`[${currentTime}] Error processing URL: ${error.message}`);
    errorCount += 1;
  }
});

router.addHandler("creator", async ({ request, $, log }) => {
  const currentTime = new Date().toString();
  try {
    const title = $("title").text();
    log.info(`[${currentTime}] ${title} - ${request.loadedUrl}`);
    const name = $("div.creator-name-wrapper h1").text();
    const imgSrc = $("img.creator-profile-image-round").attr("src");
    const bio = $(".creator-bio").text();
    const socialLinks = utils.social.parseHandlesFromHtml($("ul.creator-social-media-links").html());
    const profileType = "creator";

    await Dataset.pushData({
      url: request.loadedUrl,
      title,
      name,
      imgSrc,
      bio,
      socialLinks,
      profileType,
    });
    processedCount += 1;
  } catch (error) {
    log.error(`[${currentTime}] Error processing URL: ${error.message}`);
    errorCount += 1;
  }
});
