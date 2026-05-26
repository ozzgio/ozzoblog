import { useEffect, useRef, useId } from "react";
import { Box, useColorModeValue } from "@chakra-ui/react";

// Renders a Mermaid diagram client-side. Safe for Next.js SSR — no output on server.
// Colors match the blog's brand palette from libs/theme.js.
export default function MermaidDiagram({ chart }) {
  const id = useId().replace(/:/g, "-");
  const containerRef = useRef(null);
  const isDark = useColorModeValue(false, true);

  useEffect(() => {
    if (!chart || !containerRef.current) return;

    let cancelled = false;

    import("mermaid").then((mod) => {
      if (cancelled) return;
      const mermaid = mod.default;

      mermaid.initialize({
        startOnLoad: false,
        theme: "base",
        themeVariables: {
          background: isDark ? "#1a1a1e" : "#ffffff",
          primaryTextColor: isDark ? "#f7fafc" : "#1a202c",
          lineColor: "#475569",
          fontSize: "14px",
        },
        flowchart: { useMaxWidth: true, htmlLabels: true },
        securityLevel: "loose",
      });

      mermaid
        .render(`mermaid-${id}`, chart)
        .then(({ svg }) => {
          if (cancelled || !containerRef.current) return;
          containerRef.current.innerHTML = svg;
          // Make the SVG responsive
          const svgEl = containerRef.current.querySelector("svg");
          if (svgEl) {
            svgEl.style.maxWidth = "100%";
            svgEl.style.height = "auto";
          }
        })
        .catch(() => {
          if (cancelled || !containerRef.current) return;
          containerRef.current.innerHTML = `<pre style="font-size:11px;color:#dc2626">${chart}</pre>`;
        });
    });

    return () => { cancelled = true; };
  }, [chart, id, isDark]);

  return (
    <Box
      ref={containerRef}
      my={6}
      overflowX="auto"
      borderRadius="md"
      display="flex"
      justifyContent="center"
    />
  );
}
