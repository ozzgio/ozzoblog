import { motion, useReducedMotion } from "framer-motion";

const Section = ({ children, delay = 0.5 }) => {
  const reduce = useReducedMotion();
  return (
    <motion.section
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={reduce ? { duration: 0 } : { duration: 0.8, delay }}
      style={{ marginBottom: "1.5rem" }}
    >
      {children}
    </motion.section>
  );
};

export default Section;
