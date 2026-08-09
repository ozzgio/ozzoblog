export const SITE_URL = "https://ozzo.blog";
export const DEFAULT_SOCIAL_IMAGE_URL = `${SITE_URL}/images/zicon.png`;

const resolveSiteLocalUrl = (value) =>
  value.startsWith("/") ? `${SITE_URL}${value}` : value;

export const resolveSocialImageUrl = (
  image,
  fallbackImage = DEFAULT_SOCIAL_IMAGE_URL,
) => {
  const value = typeof image === "string" ? image.trim() : "";
  const fallback =
    typeof fallbackImage === "string" && fallbackImage.trim()
      ? fallbackImage.trim()
      : DEFAULT_SOCIAL_IMAGE_URL;

  return resolveSiteLocalUrl(value || fallback);
};
