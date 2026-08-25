import Link from "next/link";
import { motion } from "framer-motion";
import MoonZMark from "./icons/moon-z-mark";
import { useBrandIntro } from "./brand-intro-context";
import { FLY_TRANSITION } from "./brand-intro";

// The intro (components/brand-intro.js) owns forming "ozzo" into the mark
// and flying it here. This just reserves the mark's slot in the nav and,
// once the intro says it has landed, mounts the matching layoutId so
// Framer Motion's shared-layout transition resolves into this exact spot.
const Logo = () => {
  const { markLanded } = useBrandIntro();

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
            <MoonZMark size={30} />
          </motion.span>
        )}
      </span>
    </Link>
  );
};

export default Logo;
