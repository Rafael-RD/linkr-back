import urlMetadata from "url-metadata";
import * as cheerio from "cheerio";

export async function getMetadata(link) {
  const meta = await urlMetadata(link, { includeResponseBody: true });
  meta.myTitle = cheerio.load(meta.responseBody)("title").text();
  delete meta.responseBody;
  return meta;
}
