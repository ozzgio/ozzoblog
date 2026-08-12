import { motion, useReducedMotion } from "framer-motion";
import { chakra, shouldForwardProp } from "@chakra-ui/react";

const StyledDiv = chakra(motion.div, {
  shouldForwardProp: (prop) => {
    return shouldForwardProp(prop) || prop === "transition";
  },
});

const Section = ({ children, delay = 0.5 }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <StyledDiv
      initial={shouldReduceMotion ? false : { y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.8, delay }}
      mb={6}
    >
      {children}
    </StyledDiv>
  );
};

export default Section;
