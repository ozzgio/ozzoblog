// Keep attribution in the URL so destination analytics can identify this visit.
export function projectReferralUrl(href, projectId, placement) {
  if (!href) return href;
  let url;
  try {
    url = new URL(href);
  } catch {
    return href;
  }
  if (
    !["https:", "http:"].includes(url.protocol) ||
    ["ozzo.blog", "www.ozzo.blog"].includes(url.hostname)
  )
    return href;
  for (const [key, value] of Object.entries({
    ref: "ozzo.blog",
    utm_source: "ozzo.blog",
    utm_medium: "referral",
    utm_campaign: projectId,
    utm_content: placement,
  }))
    url.searchParams.set(key, value);
  return url.toString();
}
