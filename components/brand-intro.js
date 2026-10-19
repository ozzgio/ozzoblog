import { useEffect, useRef, useState } from "react";
import { useColorModeValue } from "./ui/color-mode";
import { Box, Button, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { BrandIntroContext } from "./brand-intro-context";
import MoonZMark from "./icons/moon-z-mark";

const EASE = [0.76, 0, 0.24, 1];
const SEEN_KEY = "ozzo-intro-seen";
export const FLY_TRANSITION = { duration: 0.9, ease: [0.22, 1, 0.36, 1] };

const BrandIntro = ({ children, isHome }) => {
  const [phase, setPhase] = useState("pending");
  const skipRef = useRef(null);
  const seenOnEntry = useRef(null);
  const bg = useColorModeValue("#f7f5f2", "#1a1a1e");
  const ink = useColorModeValue("#1c1917", "#f7f5f2");
  const muted = useColorModeValue("gray.600", "gray.400");
  const accent = useColorModeValue("#c05621", "#f6ad55");
  const active = phase === "word" || phase === "mark";

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
    const next =
      phase === "word" ? "mark" : phase === "mark" ? "flying" : "done";
    // Leave almost two seconds to read after the last letter settles.
    const delay = phase === "word" ? 3000 : phase === "mark" ? 850 : 1000;
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
              viewBox="0 0 760 420"
              initial={{ opacity: 0, rotate: -18, scale: 0.8 }}
              animate={
                phase === "word"
                  ? { opacity: 1, rotate: -8, scale: 1 }
                  : { opacity: 0, rotate: 12, scale: 0.2 }
              }
              transition={{ duration: 0.9, ease: EASE }}
              style={{
                position: "absolute",
                width: "100%",
                overflow: "visible",
              }}
            >
              <motion.ellipse
                cx="380"
                cy="210"
                rx="355"
                ry="115"
                fill="none"
                stroke={accent}
                strokeWidth="1"
                strokeOpacity="0.3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: EASE }}
              />
              <motion.ellipse
                cx="380"
                cy="210"
                rx="355"
                ry="115"
                fill="none"
                stroke={accent}
                strokeWidth="3"
                pathLength="1"
                strokeDasharray="0.08 0.92"
                initial={{ strokeDashoffset: 0.25 }}
                animate={{ strokeDashoffset: -0.75 }}
                transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
              />
            </motion.svg>

            <Box position="absolute" textAlign="center" color={ink}>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{
                  opacity: phase === "word" ? 1 : 0,
                  y: phase === "word" ? 0 : -8,
                }}
                transition={{
                  duration: 0.4,
                  delay: phase === "word" ? 0.15 : 0,
                }}
              >
                <Text
                  fontSize={{ base: "10px", md: "xs" }}
                  letterSpacing="0.22em"
                  color={muted}
                  mb={3}
                >
                  OZZO.BLOG
                </Text>
              </motion.div>
              <Box
                display="flex"
                justifyContent="center"
                overflow="hidden"
                pb="0.12em"
                style={{
                  fontFamily: "var(--font-bricolage-grotesque), sans-serif",
                  fontSize: "clamp(96px, 23vw, 240px)",
                  fontWeight: 800,
                  lineHeight: 1,
                  letterSpacing: "-0.075em",
                }}
              >
                {["o", "z", "z", "o"].map((letter, i) => (
                  <motion.span
                    key={i}
                    initial={{ y: "115%", rotate: 8 }}
                    animate={{
                      y: phase === "word" ? "0%" : "-120%",
                      rotate: phase === "word" ? 0 : -8,
                    }}
                    transition={{
                      duration: phase === "word" ? 0.9 : 0.45,
                      delay: i * 0.07,
                      ease: EASE,
                    }}
                    style={{
                      display: "inline-block",
                      color: i === 3 ? accent : ink,
                      paddingRight: i === 3 ? "0.075em" : 0,
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </Box>
              <motion.div
                animate={{ opacity: phase === "word" ? 1 : 0 }}
                transition={{ duration: 0.25 }}
              >
                <Text fontSize={{ base: "xs", md: "sm" }} color={muted} mt={2}>
                  Software, books, and writing.
                </Text>
              </motion.div>
            </Box>

            {phase === "mark" && (
              <motion.div
                layoutId="brand-mark"
                transition={FLY_TRANSITION}
                style={{ width: 120, height: 120, position: "relative" }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.55, rotate: -35 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                >
                  <MoonZMark size={120} />
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
