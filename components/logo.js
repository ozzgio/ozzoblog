import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import MoonZMark from "./icons/moon-z-mark";
import { useBrandIntro } from "./brand-intro-context";
import { FLY_TRANSITION } from "./brand-intro";

// The intro (components/brand-intro.js) owns forming "ozzo" into the mark
// and flying it here. This just reserves the mark's slot in the nav and,
// once the intro says it has landed, mounts the matching layoutId so
// Framer Motion's shared-layout transition resolves into this exact spot.
//
// It also doubles as the route-change indicator: a brief pulse on the mark
// itself while Next.js is navigating, instead of a separate loading spinner.
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
    <Link href="/" scroll={false} aria-label="Ozzo — home">
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          width: 30,
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
              <MoonZMark size={30} />
            </motion.span>
          </motion.span>
        )}
      </span>
    </Link>
  );
};

export default Logo;
