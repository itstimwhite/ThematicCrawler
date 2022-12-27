import { Dataset, createCheerioRouter, utils, log } from "crawlee";

export const router = createCheerioRouter();

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
  //if it doesnt match these two, it will go to the default handler
  await enqueueLinks({
    globs: ["https://app.hellothematic.com/**"],
    label: "default",
  });
});

router.addHandler("artist", async ({ request, $, log, e }) => {
  const currentTime = new Date().toString();

  try {
    const title = $("title").text();
    log.info(`[${currentTime}] ${title} - ${request.loadedUrl}`);
    const name = $("div.name-wrapper h1").text();
    log.info(`[${currentTime}] ${name}`);
    const imgSrc = $("img.profile-image-round").attr("src");
    log.info(`[${currentTime}] ${imgSrc}`);
    const bio = $("div.person-description").text();
    log.info(`[${currentTime}] ${bio}`);
    const socialLinks = utils.social.parseHandlesFromHtml($("ul.social-media-links").html());
    const profileType = "artist";

    // Initialize variables for separate social link fields
    let soundcloudURL = "";
    let spotifyURL = "";
    let applemusicURL = "";

    // Iterate over the social links and store the SoundCloud, Spotify, and Apple Music URLs separately
    socialLinks.forEach((link) => {
      if (/soundcloud/.test(link.url)) {
        soundcloudURL = link.url;
      } else if (/spotify/.test(link.url)) {
        spotifyURL = link.url;
      } else if (/applemusic/.test(link.url)) {
        applemusicURL = link.url;
      }
    });

    await Dataset.pushData({
      url: request.loadedUrl,
      title,
      name,
      imgSrc,
      bio,
      socialLinks,
      soundcloudURL,
      spotifyURL,
      applemusicURL,
      profileType,
    });
  } catch (error) {
    log.error(`[${currentTime}] Error processing URL: ${error.message}`);
    errorCount += 1;
  }
});
router.addHandler("creator", async ({ request, $, log }) => {
  const currentTime = new Date().toString();
  let processedCount = 0;
  let errorCount = 0;
  try {
    const title = $("title").text();
    log.info(`[${currentTime}] ${title} - ${request.loadedUrl}`);
    const name = $("div.name-wrapper h1").text();
    log.info(`[${currentTime}] ${name}`);
    const imgSrc = $("img.profile-image-round").attr("src");
    log.info(`[${currentTime}] ${imgSrc}`);
    const bio = $("div.person-description").text();
    log.info(`[${currentTime}] ${bio}`);
    const socialLinks = utils.social.parseHandlesFromHtml($("ul.social-media-links").html());

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
  } catch (error) {
    log.error(`[${currentTime}] Error processing URL: ${error.message}`);
  }
});
