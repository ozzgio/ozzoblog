import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { Box } from "@chakra-ui/react";
import { useBrandIntro } from "./brand-intro-context";
import { FLY_TRANSITION } from "./brand-intro";

// Share the intro landing position and pulse the wordmark during navigation.
const Logo = () => {
  const { markLanded } = useBrandIntro();
  const router = useRouter();
  const [navigating, setNavigating] = useState(false);

  useEffect(() => {
    const start = () => setNavigating(true);
    const done = () => setNavigating(false);
    router.events.on("routeChangeStart", start);
    router.events.on("routeChangeComplete", done);
    router.events.on("routeChangeError", done);
    return () => {
      router.events.off("routeChangeStart", start);
      router.events.off("routeChangeComplete", done);
      router.events.off("routeChangeError", done);
    };
  }, [router]);

  return (
    <Link href="/" scroll={false} aria-label="Ozzo, home">
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          minWidth: 68,
          height: 30,
          margin: "8px 10px",
        }}
      >
        {markLanded && (
          <motion.span
            layoutId="brand-mark"
            transition={FLY_TRANSITION}
            style={{ display: "inline-flex" }}
          >
            <motion.span
              animate={
                navigating
                  ? { scale: [1, 0.82, 1], opacity: [1, 0.6, 1] }
                  : { scale: 1, opacity: 1 }
              }
              transition={
                navigating
                  ? { duration: 0.7, repeat: Infinity, ease: "easeInOut" }
                  : { duration: 0.2 }
              }
              style={{ display: "inline-flex" }}
            >
              <Box
                as="span"
                data-brand-wordmark=""
                fontFamily="heading"
                fontSize="28px"
                fontWeight="800"
                letterSpacing="-0.06em"
                lineHeight="1"
                color="fg"
              >
                ozzo
                <Box as="span" color="accent.link">
                  .
                </Box>
              </Box>
            </motion.span>
          </motion.span>
        )}
      </span>
    </Link>
  );
};

export default Logo;
