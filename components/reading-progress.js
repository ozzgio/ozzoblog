import { motion, useScroll, useSpring } from "framer-motion";

// A thin fixed bar tracking scroll progress through a specific element
// (the article body, not the whole page -- so it reaches 100% when the
// reading is actually done, not when the newsletter form below it
// scrolls past). Sits above the navbar's z-index, at the very top edge.
const ReadingProgress = ({ targetRef, color }) => {
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 40,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        background: color,
        transformOrigin: "0%",
        scaleX,
        zIndex: 20,
      }}
    />
  );
};

export default ReadingProgress;
