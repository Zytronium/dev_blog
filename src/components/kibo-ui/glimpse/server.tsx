const TITLE_REGEX = /<title[^>]*>([^<]+)<\/title>/;
const OG_TITLE_REGEX = /<meta[^>]*property="og:title"[^>]*content="([^"]+)"/;
const DESCRIPTION_REGEX = /<meta[^>]*name="description"[^>]*content="([^"]+)"/;
const OG_DESCRIPTION_REGEX =
    /<meta[^>]*property="og:description"[^>]*content="([^"]+)"/;
const OG_IMAGE_REGEX = /<meta[^>]*property="og:image"[^>]*content="([^"]+)"/;

const decodeHtmlEntities = (str: string): string =>
    str
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
        .replace(/&#x([a-fA-F0-9]+);/g, (_, hex) =>
            String.fromCharCode(parseInt(hex, 16))
        );

export const glimpse = async (url: string) => {
  const response = await fetch(url);
  const data = await response.text();
  const titleMatch = data.match(TITLE_REGEX) || data.match(OG_TITLE_REGEX);
  const descriptionMatch =
      data.match(DESCRIPTION_REGEX) || data.match(OG_DESCRIPTION_REGEX);
  const imageMatch = data.match(OG_IMAGE_REGEX);

  return {
    title: titleMatch?.at(1) ? decodeHtmlEntities(titleMatch.at(1)!) : null,
    description: descriptionMatch?.at(1)
        ? decodeHtmlEntities(descriptionMatch.at(1)!)
        : null,
    image: imageMatch?.at(1) ?? null,
  };
};
