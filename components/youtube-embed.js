import { useState } from "react";
import { Box } from "@chakra-ui/react";
import { IoPlayCircle } from "react-icons/io5";

// Parse a YouTube video id from any common URL form (watch?v=, youtu.be/,
// /embed/, /shorts/, /live/) or accept a bare 11-char id. Returns "" when no
// id can be found, which the caller treats as "not a YouTube embed" so a
// malformed fence renders as a normal code block instead of vanishing.
export function parseYouTubeId(value) {
  const url = String(value || "").trim();
  if (!url) return "";

  if (/^[A-Za-z0-9_-]{11}$/.test(url)) return url;

  try {
    const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      return parsed.pathname.slice(1).split("/")[0] || "";
    }

    const v = parsed.searchParams.get("v");
    if (v) return v;

    const match = parsed.pathname.match(/\/(?:embed|shorts|live)\/([A-Za-z0-9_-]+)/);
    if (match) return match[1];
  } catch {
    return "";
  }

  return "";
}

const thumbnailUrl = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

// Privacy-respecting YouTube embed (the "lite-youtube" pattern). The page
// loads only a thumbnail image; the youtube-nocookie.com iframe is created on
// click, so no third-party scripts or cookies run until the reader chooses to
// play. Visual weight matches the Mermaid diagram blocks in the article body.
export default function YoutubeEmbed({ url, title }) {
  const [activated, setActivated] = useState(false);
  const id = parseYouTubeId(url);

  if (!id) return null;

  const label = title || "YouTube video";

  return (
    <Box
      as="div"
      position="relative"
      width="100%"
      paddingBottom="56.25%"
      mb={6}
      borderRadius="md"
      overflow="hidden"
      bg="black"
    >
      {activated ? (
        <Box
          as="iframe"
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="100%"
          border="0"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={label}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <Box
          as="button"
          type="button"
          onClick={() => setActivated(true)}
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="100%"
          margin="0"
          padding="0"
          border="0"
          background="transparent"
          cursor="pointer"
          aria-label={`Play ${label}`}
          _focusVisible={{ outline: "3px solid white", outlineOffset: "-3px" }}
        >
          {/* hqdefault carries black bars on some videos; object-fit: cover
              crops them. Plain <img> (not next/image) keeps next.config.js
              untouched and avoids adding i.ytimg.com to the image optimizer. */}
          <Box
            as="img"
            src={thumbnailUrl(id)}
            alt=""
            loading="lazy"
            decoding="async"
            position="absolute"
            top="0"
            left="0"
            width="100%"
            height="100%"
            objectFit="cover"
            opacity="0.94"
          />
          <Box
            aria-hidden="true"
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            color="white"
            fontSize={{ base: "56px", md: "72px" }}
            filter="drop-shadow(0 2px 8px rgba(0,0,0,0.7))"
          >
            <IoPlayCircle />
          </Box>
        </Box>
      )}
    </Box>
  );
}
