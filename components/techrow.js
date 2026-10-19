import { HStack, Text, Heading, Box, Icon } from "@chakra-ui/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import EnhancedChip from "./enhancedchip";

const TechRowAnimationContext = createContext(null);

export function TechRowAnimationProvider({ children }) {
  const updatersRef = useRef(new Set());
  const rafRef = useRef(null);

  useEffect(() => {
    function loop(time) {
      updatersRef.current.forEach((fn) => {
        try {
          fn(time);
        } catch (_) {
          // ignore per-row errors
        }
      });
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, []);

  const register = useCallback((fn) => {
    updatersRef.current.add(fn);
  }, []);

  const unregister = useCallback((fn) => {
    updatersRef.current.delete(fn);
  }, []);

  return (
    <TechRowAnimationContext.Provider value={{ register, unregister }}>
      {children}
    </TechRowAnimationContext.Provider>
  );
}

const TechnologyRow = ({
  category,
  enableAnimation: propEnableAnimation,
  idleResumeSeconds = 15,
}) => {
  const animationContext = useContext(TechRowAnimationContext);

  const scrollContainerRef = useRef(null);
  const innerContentRef = useRef(null);
  const [containerReady, setContainerReady] = useState(false);
  const setScrollContainerRef = useCallback((el) => {
    scrollContainerRef.current = el;
    setContainerReady(!!el);
  }, []);

  const isProgrammaticScrollRef = useRef(false);
  const userInteractingRef = useRef(false);
  const resumeTimerRef = useRef(null);
  const lastTimeRef = useRef(null);

  const dragStartXRef = useRef(0);
  const dragStartScrollLeftRef = useRef(0);
  const isDraggingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  const headerText = "fg";
  const headerSubtle = "fg.muted";
  const headerIconColor = "accent.link";

  let animationDuration = category.technologies.length * 0.9;
  switch (category.title) {
    case "DevOps & Project Management":
      animationDuration = category.technologies.length * 1;
      break;
    case "Tools & Platforms":
      animationDuration = category.technologies.length * 1.2;
      break;
    case "Frontend":
      animationDuration = category.technologies.length * 0.85;
      break;
    case "Backend":
      animationDuration = category.technologies.length * 0.7;
      break;
    default:
      break;
  }

  const scheduleResume = useCallback(() => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      userInteractingRef.current = false;
      lastTimeRef.current = undefined;
    }, idleResumeSeconds * 1000);
  }, [idleResumeSeconds]);

  const stopAnimation = useCallback(() => {
    userInteractingRef.current = true;
  }, []);

  useEffect(() => {
    if (!propEnableAnimation || !animationContext || !containerReady) return;

    function update(time) {
      const el = scrollContainerRef.current;
      if (!el || userInteractingRef.current) return;
      const contentEl = innerContentRef.current;
      const contentWidth = contentEl ? contentEl.offsetWidth : 0;
      const scrollWidth = el.scrollWidth || contentWidth;
      if (scrollWidth === 0) return;
      const oneLoopWidth = scrollWidth / 3;
      const pixelsPerSecond = oneLoopWidth / animationDuration;
      const lastTime = lastTimeRef.current ?? time;
      lastTimeRef.current = time;
      const deltaTime = (time - lastTime) / 1000;
      let newScrollLeft = el.scrollLeft + pixelsPerSecond * deltaTime;
      if (newScrollLeft >= oneLoopWidth) newScrollLeft -= oneLoopWidth;
      isProgrammaticScrollRef.current = true;
      el.scrollLeft = newScrollLeft;
      requestAnimationFrame(() => {
        isProgrammaticScrollRef.current = false;
      });
    }

    animationContext.register(update);
    lastTimeRef.current = undefined;
    return () => {
      animationContext.unregister(update);
    };
  }, [
    propEnableAnimation,
    animationDuration,
    animationContext,
    containerReady,
  ]);

  useEffect(() => {
    if (!propEnableAnimation || !containerReady || !animationContext) return;
    const scrollEl = scrollContainerRef.current;
    const contentEl = innerContentRef.current;
    if (!scrollEl) return;
    const tryStartAnimation = () => {
      const contentWidth = contentEl?.offsetWidth ?? 0;
      const hasWidth = scrollEl.scrollWidth > 0 || contentWidth > 0;
      if (hasWidth && !userInteractingRef.current) {
        lastTimeRef.current = undefined;
      }
    };
    const ro = new ResizeObserver(tryStartAnimation);
    ro.observe(scrollEl);
    if (contentEl) ro.observe(contentEl);
    tryStartAnimation();
    return () => ro.disconnect();
  }, [propEnableAnimation, containerReady, animationContext]);

  useEffect(() => {
    if (!containerReady || !scrollContainerRef.current) return;
    const el = scrollContainerRef.current;

    const onScroll = () => {
      if (isProgrammaticScrollRef.current) return;
      stopAnimation();
      scheduleResume();
    };

    const onTouchStart = () => {
      stopAnimation();
      scheduleResume();
    };

    const onTouchMove = () => {
      scheduleResume();
    };

    const onTouchEnd = () => {
      scheduleResume();
    };

    const onMouseDown = (e) => {
      if (e.button !== 0) return;
      stopAnimation();
      scheduleResume();
      dragStartXRef.current = e.clientX;
      dragStartScrollLeftRef.current = el.scrollLeft;
      isDraggingRef.current = true;
      setIsDragging(true);
    };

    const onMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      const dx = dragStartXRef.current - e.clientX;
      el.scrollLeft = dragStartScrollLeftRef.current + dx;
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
      setIsDragging(false);
      scheduleResume();
    };

    const onMouseLeave = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        setIsDragging(false);
        scheduleResume();
      }
    };

    el.addEventListener("scroll", onScroll);
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    el.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    el.addEventListener("mouseleave", onMouseLeave);

    return () => {
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      el.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [containerReady, stopAnimation, scheduleResume]);

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  const tripledTechnologies = [
    ...category.technologies,
    ...category.technologies,
    ...category.technologies,
  ];

  return (
    <Box minW={0} w="100%">
      <HStack gap={3} align="center" mb={3} justify="flex-start">
        <Icon fontSize="2xl" color={headerIconColor}>
          {category.icon}
        </Icon>
        <Box>
          <Heading
            as="h3"
            fontSize="lg"
            fontWeight="semibold"
            color={headerText}
          >
            {category.title}
          </Heading>
          <Text fontSize="sm" color={headerSubtle}>
            {category.technologies.length} technologies
          </Text>
        </Box>
      </HStack>
      <Box
        ref={propEnableAnimation ? setScrollContainerRef : undefined}
        minW={0}
        w="100%"
        overflowX={propEnableAnimation ? "auto" : "hidden"}
        overflowY="hidden"
        cursor={
          propEnableAnimation ? (isDragging ? "grabbing" : "grab") : undefined
        }
        userSelect={isDragging ? "none" : undefined}
        css={
          propEnableAnimation
            ? {
                "&::-webkit-scrollbar": { display: "none" },
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }
            : undefined
        }
        data-tech-row-scroll
      >
        <Box
          ref={propEnableAnimation ? innerContentRef : undefined}
          display="flex"
          flexWrap="nowrap"
          gap={4}
          minW="max-content"
          w="max-content"
        >
          {tripledTechnologies.map((tech, index) => (
            <EnhancedChip key={`${tech.name}-${index}`} tech={tech} delay={0} />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default TechnologyRow;
