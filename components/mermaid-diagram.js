import { useEffect, useRef, useId } from "react";
import { Box, useColorModeValue } from "@chakra-ui/react";

// Renders a Mermaid diagram client-side. Safe for Next.js SSR — no output on server.
// Colors match the blog's brand palette from libs/theme.js.
export default function MermaidDiagram({ chart }) {
  const id = useId().replace(/:/g, "-");
  const containerRef = useRef(null);
  const isDark = useColorModeValue(false, true);
  const surfaceBg = useColorModeValue("#f8fafc", "#111827");
  const surfaceBorder = useColorModeValue("#e2e8f0", "#334155");
  const textColor = isDark ? "#e5e7eb" : "#0f172a";
  const edgeLabelBg = isDark ? "#1f2937" : "#ffffff";
  const arrowColor = isDark ? "#cbd5e1" : "#475569";

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
          primaryColor: isDark ? "#1f2937" : "#f8fafc",
          primaryBorderColor: isDark ? "#94a3b8" : "#475569",
          primaryTextColor: textColor,
          secondaryColor: isDark ? "#1e293b" : "#f1f5f9",
          secondaryTextColor: textColor,
          tertiaryColor: isDark ? "#0f172a" : "#f8fafc",
          tertiaryTextColor: textColor,
          textColor,
          lineColor: arrowColor,
          defaultLinkColor: arrowColor,
          edgeLabelBackground: edgeLabelBg,
          mainBkg: isDark ? "#1f2937" : "#f8fafc",
          nodeBorder: isDark ? "#94a3b8" : "#475569",
          nodeTextColor: textColor,
          clusterBkg: isDark ? "#0f172a" : "#f8fafc",
          clusterBorder: isDark ? "#475569" : "#cbd5e1",
          fontSize: "13px",
        },
        themeCSS: `
          .edgeLabel rect,
          .labelBkg {
            fill: ${edgeLabelBg} !important;
            opacity: 1 !important;
          }
          .edgeLabel p,
          .edgeLabel span,
          .edgeLabel text {
            color: ${textColor} !important;
            fill: ${textColor} !important;
            font-weight: 600 !important;
          }
          .edgePath .path,
          .flowchart-link {
            stroke-width: 2px !important;
          }
          marker path {
            fill: ${arrowColor} !important;
            stroke: ${arrowColor} !important;
          }
        `,
        flowchart: { useMaxWidth: true, htmlLabels: true },
        c4: {
          c4ShapeInRow: 3,
          c4BoundaryInRow: 1,
          c4ShapeMargin: 80,
          c4ShapePadding: 24,
          diagramMarginX: 80,
          diagramMarginY: 60,
        },
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
  }, [arrowColor, chart, edgeLabelBg, id, isDark, textColor]);

  return (
    <Box
      ref={containerRef}
      my={6}
      p={4}
      overflowX="auto"
      borderWidth="1px"
      borderColor={surfaceBorder}
      bg={surfaceBg}
      borderRadius="md"
      display="flex"
      justifyContent="center"
    />
  );
}
