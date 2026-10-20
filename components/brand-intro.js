import { useEffect, useRef, useState } from "react";
import { useColorModeValue } from "./ui/color-mode";
import { Box, Button, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { BrandIntroContext } from "./brand-intro-context";
import MoonZMark, { BRAND_Z_PATH } from "./icons/moon-z-mark";

const EASE = [0.76, 0, 0.24, 1];
const SEEN_KEY = "ozzo-intro-seen";
export const FLY_TRANSITION = { duration: 0.9, ease: [0.22, 1, 0.36, 1] };
const PHASES = {
  word: ["merge", 1500],
  merge: ["formed", 1100],
  formed: ["mark", 350],
  mark: ["flying", 1400],
  flying: ["done", 1000],
};

const BrandIntro = ({ children, isHome }) => {
  const [phase, setPhase] = useState("pending");
  const skipRef = useRef(null);
  const seenOnEntry = useRef(null);
  const bg = useColorModeValue("#f7f5f2", "#1a1a1e");
  const ink = useColorModeValue("#1c1917", "#f7f5f2");
  const muted = useColorModeValue("gray.600", "gray.400");
  const accent = useColorModeValue("#c05621", "#f6ad55");
  const active = ["word", "merge", "formed", "mark"].includes(phase);
  const merged = phase !== "word";

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let seen = false;
    try {
      // Keep the entry value stable when Strict Mode repeats this effect.
      seenOnEntry.current ??= sessionStorage.getItem(SEEN_KEY) === "1";
      seen = seenOnEntry.current;
      if (isHome) sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // Storage can be disabled; the intro still completes normally.
    }
    if (!isHome || media.matches || seen) {
      seenOnEntry.current = true;
      setPhase("done");
      return;
    }

    setPhase("word");
    const finish = () => setPhase("done");
    const onPreference = () => {
      if (media.matches) finish();
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") finish();
    };
    media.addEventListener("change", onPreference);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      media.removeEventListener("change", onPreference);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isHome]);

  useEffect(() => {
    if (phase === "pending" || phase === "done") return;
    const [next, delay] = PHASES[phase];
    const timer = setTimeout(() => setPhase(next), delay);
    return () => clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (!active) return;
    const previousFocus = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    skipRef.current?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = overflow;
      previousFocus?.focus({ preventScroll: true });
    };
  }, [active]);

  const visible = active || phase === "flying";
  const markLanded = phase === "flying" || phase === "done";

  return (
    <BrandIntroContext.Provider value={{ markLanded }}>
      <Box inert={active ? "inert" : undefined}>{children}</Box>
      {visible && (
        <Box
          position="fixed"
          inset={0}
          zIndex={50}
          display="grid"
          placeItems="center"
          pointerEvents={active ? "auto" : "none"}
          role={active ? "dialog" : undefined}
          aria-modal={active ? "true" : undefined}
          aria-label="Welcome to Ozzo"
          data-testid="brand-intro"
          data-phase={phase}
        >
          <motion.div
            initial={false}
            animate={{
              clipPath:
                phase === "flying"
                  ? "circle(0% at 50% 50%)"
                  : "circle(150% at 50% 50%)",
            }}
            transition={{ duration: 0.9, ease: EASE }}
            style={{ position: "absolute", inset: 0, background: bg }}
          />

          <motion.div
            animate={{ opacity: phase === "word" ? 1 : 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: "absolute",
              inset: "clamp(20px, 4vw, 48px)",
              color: ink,
              pointerEvents: "none",
            }}
            aria-hidden="true"
          >
            <Text fontSize="xs" fontWeight="bold" letterSpacing="0.12em">
              OZZO.BLOG
            </Text>
            <Box position="absolute" bottom={0} left={0}>
              <Text fontSize="xs" color={muted}>
                Build. Read. Write.
              </Text>
            </Box>
          </motion.div>

          <Box
            position="relative"
            w="min(86vw, 760px)"
            h="min(72vw, 420px)"
            display="grid"
            placeItems="center"
            aria-hidden="true"
          >
            <motion.svg
              viewBox="0 0 480 240"
              initial={false}
              animate={{
                opacity: phase === "mark" || phase === "flying" ? 0 : 1,
              }}
              transition={{ duration: 0.4 }}
              style={{
                position: "absolute",
                width: "100%",
                overflow: "visible",
              }}
            >
              <g transform="translate(240 120)">
                {["o", "z", "z", "o"].map((letter, i) => (
                  <motion.g
                    key={i}
                    data-intro-letter={i}
                    initial={{ opacity: 0, y: 35, x: (i - 1.5) * 96 }}
                    animate={{
                      x: merged ? 0 : (i - 1.5) * 96,
                      y: 0,
                      opacity: phase === "formed" && i >= 2 ? 0 : 1,
                    }}
                    transition={{
                      duration: merged ? 0.9 : 0.65,
                      delay: merged ? (letter === "o" ? 0.12 : 0) : i * 0.07,
                      ease: EASE,
                      opacity: { duration: 0.15 },
                    }}
                  >
                    <motion.g
                      initial={false}
                      animate={{
                        scale: merged ? 1.65 : letter === "o" ? 1 : 2.05,
                      }}
                      transition={{ duration: 0.9, ease: EASE }}
                      style={{ transformOrigin: "0px 0px" }}
                    >
                      {letter === "o" ? (
                        <motion.circle
                          r="35.5"
                          fill="none"
                          strokeWidth="13"
                          initial={false}
                          animate={{
                            stroke: i === 3 && !merged ? accent : ink,
                          }}
                          transition={{ duration: 0.9, ease: EASE }}
                        />
                      ) : (
                        <path
                          d={BRAND_Z_PATH}
                          transform="translate(-50 -50)"
                          fill={ink}
                        />
                      )}
                    </motion.g>
                  </motion.g>
                ))}
              </g>
            </motion.svg>

            <motion.div
              animate={{ opacity: phase === "word" ? 1 : 0 }}
              transition={{ duration: 0.25 }}
              style={{
                position: "absolute",
                bottom: "8%",
                textAlign: "center",
              }}
            >
              <Text fontSize={{ base: "xs", md: "sm" }} color={muted}>
                Software, books, and writing.
              </Text>
            </motion.div>

            {phase === "mark" && (
              <motion.div
                layoutId="brand-mark"
                transition={FLY_TRANSITION}
                style={{
                  width: "34.375%",
                  aspectRatio: "1",
                  position: "relative",
                }}
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  style={{ width: "100%", height: "100%" }}
                >
                  <MoonZMark size="100%" loading />
                </motion.div>
              </motion.div>
            )}
          </Box>

          {active && (
            <Button
              ref={skipRef}
              onClick={() => setPhase("done")}
              position="absolute"
              right="clamp(20px, 4vw, 48px)"
              bottom="clamp(20px, 4vw, 48px)"
              variant="ghost"
              colorPalette="orange"
              fontSize="xs"
              minH="44px"
              px={4}
              _focusVisible={{ boxShadow: `0 0 0 2px ${accent}` }}
            >
              Skip intro ↗
            </Button>
          )}
        </Box>
      )}
    </BrandIntroContext.Provider>
  );
};

export default BrandIntro;
