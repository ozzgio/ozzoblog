import { Box } from "@chakra-ui/react";
import { motion } from "framer-motion";
import MoonZMark from "./moon-z-mark";

// The brand mark popping in with a single outward-radiating ring -- used at
// the two newsletter confirmation moments (pending, confirmed) in place of
// a generic emoji, so the site's own signature shows up at the interaction
// that actually matters instead of just on page load.
const MoonZPulse = ({ size = 84 }) => (
  <Box
    position="relative"
    display="inline-flex"
    alignItems="center"
    justifyContent="center"
    mb={4}
  >
    <motion.div
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: [0.6, 1.12, 1], opacity: 1 }}
      transition={{ duration: 0.6, times: [0, 0.7, 1], ease: "easeOut" }}
    >
      <MoonZMark size={size} />
    </motion.div>
    <motion.div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        margin: "auto",
        width: size,
        height: size,
        borderRadius: "50%",
        border: "2px solid #c05621",
      }}
      initial={{ scale: 1, opacity: 0.55 }}
      animate={{ scale: 1.55, opacity: 0 }}
      transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
    />
  </Box>
);

export default MoonZPulse;
