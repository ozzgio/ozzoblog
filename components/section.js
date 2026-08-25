import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { chakra, shouldForwardProp } from "@chakra-ui/react";

const StyledDiv = chakra(motion.div, {
  shouldForwardProp: (prop) => {
    return shouldForwardProp(prop) || prop === "transition";
  },
});

const Section = ({ children, delay = 0.5 }) => {
  const shouldReduceMotion = useReducedMotion();
  // useReducedMotion() can't know the real preference during SSR, and
  // Chakra's emotion integration bakes every prop -- transition included --
  // into the generated className, so even a transition-only difference on
  // first client render mismatches the server's. Ignoring the real value
  // until after mount keeps that first render identical either way; the
  // (imperceptible, one-frame) cost is every client briefly using the
  // full-motion transition regardless of their actual preference.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const reduce = mounted && shouldReduceMotion;

  return (
    <StyledDiv
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={reduce ? { duration: 0 } : { duration: 0.8, delay }}
      mb={6}
    >
      {children}
    </StyledDiv>
  );
};

export default Section;
