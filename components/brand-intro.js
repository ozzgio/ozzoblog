import { useEffect, useState } from "react";
import { useColorModeValue } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { BrandIntroContext } from "./brand-intro-context";

const LETTERS = ["o", "z", "z", "o"];

const HOLD_MS = 1400; // "ozzo" sits large and readable before converging
const CONVERGE_S = 1; // everything below moves together, on one shared clock
const CONVERGE_EASE = [0.22, 0.61, 0.36, 1]; // one easing curve for every piece, so nothing drifts out of sync
const MARK_HOLD_MS = 650; // formed mark sits center-stage before flying to the nav
const FLY_S = 0.9; // the flight itself: center-stage -> the nav slot
const FLY_MS = FLY_S * 1000 + 150; // give the flight room to finish before the overlay unmounts
export const FLY_TRANSITION = { duration: FLY_S, ease: CONVERGE_EASE };

// Same family the mark's own "Z" is set in (components/icons/moon-z-mark.js)
// -- so the word doesn't switch typeface partway through becoming the mark.
const LETTER_FONT = {
  fontFamily: "var(--font-m-plus-rounded-1c), system-ui, sans-serif",
  fontWeight: 700,
  fontSize: "min(80px, 16vw)",
  letterSpacing: "-0.02em",
};

const CONVERGE_TRANSITION = { duration: CONVERGE_S, ease: CONVERGE_EASE };
// The "o"s should stay fully visible while they travel and swell, and only
// dissolve once they've actually arrived at center -- so opacity holds at 1
// for most of the shared clock, then fades quickly at the very end.
const O_FADE_TRANSITION = {
  ...CONVERGE_TRANSITION,
  opacity: {
    duration: CONVERGE_S * 0.25,
    delay: CONVERGE_S * 0.7,
    ease: CONVERGE_EASE,
  },
};

// Full-page intro: "ozzo" forms large and centered. Then, on one shared
// clock, both "o"s swell outward and dissolve (an echo of the disc forming
// behind them) while both "z"s converge on the exact same center point and
// scale, landing perfectly overlapped as a single glyph. The disc fades in
// and the orange crescent draws itself in on that same clock. Everything
// from here through the hold is the same element (one shared layoutId) --
// it only swaps for the real SVG mark at the very end, when it flies into
// the navbar, so there's no seam in between.
const BrandIntro = ({ children }) => {
  // word -> converging -> mark -> flying -> done
  const [phase, setPhase] = useState("word");
  const [skip, setSkip] = useState(null); // null until we know, avoids a flash

  const bg = useColorModeValue("#f7f5f2", "#1a1a1e");
  const textColor = useColorModeValue("#2d3748", "#ffffff");

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setSkip(mq.matches);
    if (mq.matches) return;
    const t = setTimeout(() => setPhase("converging"), HOLD_MS);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase !== "converging") return;
    const t = setTimeout(() => setPhase("mark"), CONVERGE_S * 1000);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "mark") return;
    const t = setTimeout(() => setPhase("flying"), MARK_HOLD_MS);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "flying") return;
    const t = setTimeout(() => setPhase("done"), FLY_MS);
    return () => clearTimeout(t);
  }, [phase]);

  const markLanded =
    skip === null ? false : skip || phase === "flying" || phase === "done";

  const converged = phase === "converging" || phase === "mark";

  return (
    <BrandIntroContext.Provider value={{ markLanded }}>
      {children}
      <AnimatePresence>
        {skip === false && phase !== "done" && (
          <motion.div
            key="brand-intro-overlay"
            initial={{ opacity: 1 }}
            animate={{ opacity: phase === "flying" ? 0 : 1 }}
            transition={{ duration: 0.5, delay: phase === "flying" ? 0.15 : 0 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 50,
              background: bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: phase === "flying" ? "none" : "auto",
            }}
          >
            {/* Stage: one element, one layoutId, from the moment it starts
                forming to the moment it flies to the nav -- no mid-overlay
                swap, so no seam. */}
            {phase !== "flying" && (
              <motion.div
                layoutId="brand-mark"
                transition={FLY_TRANSITION}
                style={{ position: "relative", width: 160, height: 160 }}
              >
                {converged && (
                  <svg
                    width={160}
                    height={160}
                    viewBox="0 0 100 100"
                    style={{ position: "absolute", inset: 0 }}
                  >
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="#0d1f2d"
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={CONVERGE_TRANSITION}
                      style={{ transformOrigin: "50px 50px" }}
                    />
                    {/* Fixed-length segment (pathLength never animates) --
                        only rotate moves: starts unrotated (the segment
                        sitting on the right), does one full 360 revolution,
                        and lands on the same -50deg rest position the
                        static mark (moon-z-mark.js) already uses. */}
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="#c05621"
                      strokeWidth="6"
                      pathLength={1}
                      initial={{ pathLength: 0.25, rotate: 0 }}
                      animate={{ rotate: -410 }}
                      transition={CONVERGE_TRANSITION}
                      style={{ transformOrigin: "50px 50px" }}
                    />
                  </svg>
                )}

                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {LETTERS.map((letter, i) => {
                    const isZ = letter === "z";
                    return phase === "word" ? (
                      <motion.span
                        key={i}
                        layout="position"
                        transition={CONVERGE_TRANSITION}
                        style={{
                          position: "static",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: 160,
                          color: textColor,
                          ...LETTER_FONT,
                        }}
                      >
                        {letter}
                      </motion.span>
                    ) : (
                      <motion.span
                        key={i}
                        layout="position"
                        animate={
                          isZ
                            ? { opacity: 1, scale: 0.72 }
                            : { opacity: 0, scale: 1.15 }
                        }
                        transition={isZ ? CONVERGE_TRANSITION : O_FADE_TRANSITION}
                        style={{
                          position: "absolute",
                          inset: 0,
                          margin: "auto",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "fit-content",
                          height: "fit-content",
                          color: isZ ? "#f7f5f2" : textColor,
                          ...LETTER_FONT,
                          fontWeight: isZ ? LETTER_FONT.fontWeight : 400,
                          letterSpacing: "normal",
                        }}
                      >
                        {letter}
                      </motion.span>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </BrandIntroContext.Provider>
  );
};

export default BrandIntro;
