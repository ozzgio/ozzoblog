import { useEffect, useRef } from "react";
import { useColorMode } from "@chakra-ui/react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { playfairDisplay } from "../fonts";

// --- Planet icon draw functions (64×64 canvas, transparent bg) ---
//
// Every icon shares BMW's recipe (the one icon in this set that already
// read clearly at the ~0.38-scale sprite size): a thick dark ring, one flat
// interior color, and a bold glyph with no gradients/highlights/fine
// linework. Realistic shading just turns to mush at this render size.
function drawBadgeBase(ctx, S, innerColor, outerColor = "#111827") {
  const cx = S / 2, cy = S / 2, R = S * 0.45, r = R * 0.82;
  ctx.fillStyle = outerColor;
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = innerColor;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
  return { cx, cy, r };
}

function drawDumbbell(ctx, S) {
  const { cx, cy, r } = drawBadgeBase(ctx, S, "#b91c1c");
  const plateW = r * 0.24, plateH = r * 0.68, barW = r * 0.58, barH = r * 0.2;
  ctx.fillStyle = "#e5e7eb";
  ctx.fillRect(cx - barW / 2, cy - barH / 2, barW, barH);
  [cx - barW / 2 - plateW / 2, cx + barW / 2 + plateW / 2].forEach((px) => {
    const x = px - plateW / 2, y = cy - plateH / 2, w = plateW, h = plateH, rad = plateW / 2;
    ctx.beginPath();
    ctx.moveTo(x + rad, y);
    ctx.arcTo(x + w, y, x + w, y + h, rad);
    ctx.arcTo(x + w, y + h, x, y + h, rad);
    ctx.arcTo(x, y + h, x, y, rad);
    ctx.arcTo(x, y, x + w, y, rad);
    ctx.closePath();
    ctx.fill();
  });
}

function drawBook(ctx, S) {
  const { cx, cy, r } = drawBadgeBase(ctx, S, "#92400e");
  const w = r * 0.82, h = r * 0.66;
  ctx.fillStyle = "#fef3e2";
  ctx.beginPath();
  ctx.moveTo(cx, cy - h / 2);
  ctx.lineTo(cx - w / 2, cy - h / 2 + h * 0.14);
  ctx.lineTo(cx - w / 2, cy + h / 2);
  ctx.lineTo(cx, cy + h / 2 - h * 0.14);
  ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx, cy - h / 2);
  ctx.lineTo(cx + w / 2, cy - h / 2 + h * 0.14);
  ctx.lineTo(cx + w / 2, cy + h / 2);
  ctx.lineTo(cx, cy + h / 2 - h * 0.14);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = "#92400e";
  ctx.lineWidth = r * 0.09;
  ctx.beginPath();
  ctx.moveTo(cx, cy - h / 2); ctx.lineTo(cx, cy + h / 2 - h * 0.14);
  ctx.stroke();
}

function drawRoundel(ctx, S) {
  // Saturated BMW-blue planet disc — matches the other planets' recipe
  // (dark ring + colored disc + a centered mark).
  const { cx, cy, r } = drawBadgeBase(ctx, S, "#1c69d4");
  // BMW roundel as a centered mark on the disc: white disc with two blue
  // diagonal quarters, ringed dark so the quartered pattern stays crisp on
  // the blue planet instead of bleeding into it. The plain quartered disc
  // (white background, no ring) read as a crosshair once every icon shared
  // the badge style — the dark ring is what keeps it a recognizable mark.
  const m = r * 0.72;
  ctx.save();
  ctx.beginPath(); ctx.arc(cx, cy, m, 0, Math.PI * 2); ctx.clip();
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(cx - m, cy - m, m * 2, m * 2);
  ctx.fillStyle = "#1c69d4";
  ctx.fillRect(cx - m, cy - m, m, m);
  ctx.fillRect(cx, cy, m, m);
  ctx.restore();
  ctx.strokeStyle = "#111827";
  ctx.lineWidth = r * 0.12;
  ctx.beginPath(); ctx.arc(cx, cy, m, 0, Math.PI * 2); ctx.stroke();
}

function drawTerminal(ctx, S) {
  const { cx, cy, r } = drawBadgeBase(ctx, S, "#14532d");
  ctx.strokeStyle = "#4ade80";
  ctx.lineWidth = r * 0.22;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.42, cy - r * 0.38);
  ctx.lineTo(cx + r * 0.05, cy);
  ctx.lineTo(cx - r * 0.42, cy + r * 0.38);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + r * 0.15, cy + r * 0.42);
  ctx.lineTo(cx + r * 0.55, cy + r * 0.42);
  ctx.stroke();
}

function drawPencil(ctx, S) {
  const { cx, cy, r } = drawBadgeBase(ctx, S, "#581c87");
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-Math.PI * 0.25);
  const bw = r * 0.32, bh = r * 1.15;
  ctx.fillStyle = "#f4a0a0";
  ctx.fillRect(-bw / 2, -bh / 2, bw, bh * 0.14);
  ctx.fillStyle = "#facc15";
  ctx.fillRect(-bw / 2, -bh / 2 + bh * 0.14, bw, bh * 0.62);
  ctx.fillStyle = "#d4a96a";
  ctx.beginPath();
  ctx.moveTo(-bw / 2, bh * 0.26); ctx.lineTo(bw / 2, bh * 0.26); ctx.lineTo(0, bh * 0.42);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = "#1f2937";
  ctx.beginPath();
  ctx.moveTo(-bw * 0.18, bh * 0.36); ctx.lineTo(bw * 0.18, bh * 0.36); ctx.lineTo(0, bh * 0.46);
  ctx.closePath(); ctx.fill();
  ctx.restore();
}

function drawHeart(ctx, S) {
  const { cx, cy, r } = drawBadgeBase(ctx, S, "#831843");
  ctx.fillStyle = "#fb7185";
  const s = r * 0.92, topY = cy - s * 0.32, top = s * 0.3;
  ctx.beginPath();
  ctx.moveTo(cx, topY + top);
  ctx.bezierCurveTo(cx, topY, cx - s / 2, topY, cx - s / 2, topY + top);
  ctx.bezierCurveTo(cx - s / 2, topY + (s + top) / 2, cx, topY + (s + top) / 2, cx, topY + s);
  ctx.bezierCurveTo(cx, topY + (s + top) / 2, cx + s / 2, topY + (s + top) / 2, cx + s / 2, topY + top);
  ctx.bezierCurveTo(cx + s / 2, topY, cx, topY, cx, topY + top);
  ctx.closePath();
  ctx.fill();
}

function drawCoffee(ctx, S) {
  const { cx, cy, r } = drawBadgeBase(ctx, S, "#5c3d2e");
  const w = r * 0.7, h = r * 0.62;
  ctx.fillStyle = "#f0e4d0";
  ctx.beginPath();
  ctx.moveTo(cx - w / 2, cy - h / 2);
  ctx.lineTo(cx + w / 2, cy - h / 2);
  ctx.lineTo(cx + w * 0.4, cy + h / 2);
  ctx.lineTo(cx - w * 0.4, cy + h / 2);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#f0e4d0";
  ctx.lineWidth = r * 0.14;
  ctx.beginPath();
  ctx.arc(cx + w * 0.5, cy - h * 0.05, r * 0.22, -Math.PI * 0.5, Math.PI * 0.5);
  ctx.stroke();
}

// --- Emissive map: "ozzo's blog" two-line text with glow ---
// Painted in Playfair Display (a high-contrast display serif) for an elegant
// wordmark that contrasts with the sans body. next/font exposes the
// self-hosted family name via .style.fontFamily — the only handle canvas
// text can use (CSS variables don't resolve on a canvas). Webfonts load
// async, so the text layer is repainted from the effect once the weight is
// actually available.
const MOON_FONT_FAMILY = playfairDisplay.style.fontFamily;
const MOON_FONT_SIZE = 60;
const MOON_FONT = `900 ${MOON_FONT_SIZE}px ${MOON_FONT_FAMILY}, serif`;
const MOON_FONT_LOAD = `900 ${MOON_FONT_SIZE}px ${MOON_FONT_FAMILY}`;

function paintEmissiveMap(ctx, W, H) {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, W, H);
  const cx = W / 2, cy = H / 2;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = MOON_FONT;
  const lines = [{ text: "ozzo's", y: cy - 44 }, { text: "blog", y: cy + 44 }];
  // subtle glow — keep blur small so glyph edges stay crisp
  ctx.shadowColor = "rgba(130,190,255,0.9)";
  ctx.shadowBlur = 6;
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  lines.forEach(({ text, y }) => ctx.fillText(text, cx, y));
  // crisp white text on top
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#ffffff";
  lines.forEach(({ text, y }) => ctx.fillText(text, cx, y));
}

function buildSphereEmissiveMap() {
  const W = 512, H = 512;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  paintEmissiveMap(c.getContext("2d"), W, H);
  return c;
}

// --- Moon surface texture (procedural grayscale lunar map) ---
// One canvas is used twice — as the sphere's albedo (map) and as its bumpMap —
// so crater rims catch the directional sunlight and the surface gets real
// relief shading as the moon turns. Features are drawn wrapped horizontally
// so the equirectangular seam (where u=0 meets u=1) doesn't cut them in half.
// Seeded so the moon looks identical on every load.
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clampByte = (v) => (v < 0 ? 0 : v > 255 ? 255 : v);

function drawMaria(ctx, x, y, r) {
  const g = ctx.createRadialGradient(x, y, r * 0.1, x, y, r);
  g.addColorStop(0, "rgba(38,36,38,0.85)");
  g.addColorStop(0.6, "rgba(54,51,51,0.5)");
  g.addColorStop(1, "rgba(70,66,64,0)");
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
}

function drawCrater(ctx, x, y, r) {
  // Dark floor → depression in the bump.
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, "rgba(24,22,22,0.55)");
  g.addColorStop(0.75, "rgba(24,22,22,0.16)");
  g.addColorStop(1, "rgba(24,22,22,0)");
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  // Bright rim → raised in the bump, catches the sun.
  ctx.strokeStyle = "rgba(240,240,240,0.32)";
  ctx.lineWidth = Math.max(0.5, r * 0.14);
  ctx.beginPath(); ctx.arc(x, y, r * 0.9, 0, Math.PI * 2); ctx.stroke();
}

function buildMoonTexture() {
  const W = 1024, H = 512;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const ctx = c.getContext("2d");
  const rng = mulberry32(20260623);

  // Highland base — light gray regolith.
  ctx.fillStyle = "#a8a8a8";
  ctx.fillRect(0, 0, W, H);

  // Maria (the dark lunar "seas"), wrapped across the seam.
  const maria = [
    [260, 205, 155], [470, 185, 110], [365, 300, 100],
    [760, 225, 135], [905, 305, 82], [150, 320, 72],
    [625, 335, 78], [840, 175, 64],
  ];
  maria.forEach(([x, y, r]) => {
    for (let k = -1; k <= 1; k++) drawMaria(ctx, x + k * W, y, r);
  });

  // Medium + small craters, wrapped across the seam.
  for (let i = 0; i < 80; i++) {
    const x = rng() * W, y = 36 + rng() * (H - 72), r = 6 + rng() * 24;
    for (let k = -1; k <= 1; k++) drawCrater(ctx, x + k * W, y, r);
  }
  for (let i = 0; i < 280; i++) {
    const x = rng() * W, y = 18 + rng() * (H - 36), r = 1.5 + rng() * 4.5;
    for (let k = -1; k <= 1; k++) drawCrater(ctx, x + k * W, y, r);
  }

  // Fine regolith grain.
  const img = ctx.getImageData(0, 0, W, H);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (rng() - 0.5) * 16;
    d[i] = clampByte(d[i] + n);
    d[i + 1] = clampByte(d[i + 1] + n);
    d[i + 2] = clampByte(d[i + 2] + n);
  }
  ctx.putImageData(img, 0, 0);

  return c;
}

// --- Three.js helpers ---
function createOrbitRing(radius, color, opacity) {
  const pts = [];
  for (let i = 0; i <= 128; i++) {
    const a = (i / 128) * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
  }
  return new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(pts),
    new THREE.LineBasicMaterial({ color, transparent: true, opacity })
  );
}

function createSprite(drawFn) {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  drawFn(c.getContext("2d"), 64);
  const tex = new THREE.CanvasTexture(c);
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(0.38, 0.38, 0.38);
  return { sprite, tex, mat };
}

// --- Component ---
const MoonHero = ({ size = 220 }) => {
  const mountRef = useRef(null);
  const { colorMode } = useColorMode();

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let disposed = false;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(size, size);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    // s=2.1 — outer orbit (r=2.02) has ~5px margin; camera tilted ~22° above orbital plane
    const s = 2.1;
    const camera = new THREE.OrthographicCamera(-s, s, s, -s, 0.01, 50);
    camera.position.set(0, 3.5, 8.5);

    // Sunlight from the upper-right-front; ambient + a faint cool fill are
    // kept low so the moon gets a real day/night terminator. Lights only
    // affect the sphere — rings and planet sprites are unlit materials.
    scene.add(new THREE.AmbientLight(0x6b7280, 0.12));
    const key = new THREE.DirectionalLight(0xfff3e6, 1.9);
    key.position.set(3.5, 2.2, 4);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x2a3a66, 0.18);
    fill.position.set(-3, -1.5, -2);
    scene.add(fill);

    // Group wrapping the whole solar system — used for X-axis tilt animation
    const systemGroup = new THREE.Group();
    scene.add(systemGroup);

    // Central moon — procedural lunar surface (albedo + bump) self-lit with
    // "ozzo's blog" via the emissiveMap, so the brand glows on both the lit
    // highlands and the dark limb.
    const sphereGeo = new THREE.SphereGeometry(1, 64, 64);
    const moonTex = new THREE.CanvasTexture(buildMoonTexture());
    moonTex.colorSpace = THREE.SRGBColorSpace;
    moonTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    const zEmissiveTex = new THREE.CanvasTexture(buildSphereEmissiveMap());
    zEmissiveTex.colorSpace = THREE.SRGBColorSpace;
    // Webfonts load async; if Playfair wasn't ready when the text canvas was
    // first painted, repaint it now that it is.
    if (document.fonts && document.fonts.load) {
      document.fonts
        .load(MOON_FONT_LOAD, "ozzo's blog")
        .then(() => {
          if (disposed) return;
          paintEmissiveMap(zEmissiveTex.image.getContext("2d"), 512, 512);
          zEmissiveTex.needsUpdate = true;
        })
        .catch(() => {});
    }
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: moonTex,
      bumpMap: moonTex,
      bumpScale: 0.04,
      emissiveMap: zEmissiveTex,
      emissive: new THREE.Color(1, 1, 1),
      emissiveIntensity: 1.0,
      roughness: 0.97,
      metalness: 0.0,
    });
    systemGroup.add(new THREE.Mesh(sphereGeo, sphereMat));

    // Orbit rings — dark in light mode, light in dark mode
    const ringColor = colorMode === "dark" ? 0xffffff : 0x1e3a5f;
    const ringOpacity = colorMode === "dark" ? 0.18 : 0.55;
    const rings = [1.42, 1.72, 2.02].map((r) => createOrbitRing(r, ringColor, ringOpacity));
    rings.forEach((r) => systemGroup.add(r));

    // Planets: [drawFn, radius, startAngle, speed rad/s]
    // Inner orbits faster, outer slower — each at a distinct rate
    const PI = Math.PI;
    const defs = [
      [drawDumbbell, 1.42, 0.0,               0.9],
      [drawTerminal, 1.42, PI,                0.72],
      [drawBook,     1.72, 0.5,               0.55],
      [drawPencil,   1.72, 0.5 + PI * 2 / 3, 0.68],
      [drawHeart,    1.72, 0.5 + PI * 4 / 3, 0.46],
      [drawRoundel, 2.02, 1.1,                0.32],
      [drawCoffee,   2.02, 1.1 + PI,          0.40],
    ];

    const planetData = defs.map(([fn, rad, startAngle, speed]) => {
      const { sprite, tex, mat } = createSprite(fn);
      sprite.position.set(Math.cos(startAngle) * rad, 0, Math.sin(startAngle) * rad);
      systemGroup.add(sprite);
      return { sprite, tex, mat, rad, angle: startAngle, speed };
    });

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.autoRotate = false; // manual group rotation handles this
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minAzimuthAngle = -Infinity;
    controls.maxAzimuthAngle = Infinity;

    // Pause auto-animation while user drags; resume on release
    let isInteracting = false;
    const onStart = () => { isInteracting = true; };
    const onEnd = () => { isInteracting = false; };
    controls.addEventListener("start", onStart);
    controls.addEventListener("end", onEnd);

    const clock = new THREE.Clock();
    let elapsed = 0;
    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      if (!isInteracting && !prefersReducedMotion) {
        elapsed += delta;
        systemGroup.rotation.y += 0.35 * delta;
        systemGroup.rotation.x = Math.sin(elapsed * 0.32) * 0.38;
        planetData.forEach((p) => {
          p.angle += p.speed * delta;
          p.sprite.position.set(Math.cos(p.angle) * p.rad, 0, Math.sin(p.angle) * p.rad);
        });
      }
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      controls.removeEventListener("start", onStart);
      controls.removeEventListener("end", onEnd);
      controls.dispose();
      sphereGeo.dispose();
      sphereMat.dispose();
      moonTex.dispose();
      zEmissiveTex.dispose();
      rings.forEach((r) => { r.geometry.dispose(); r.material.dispose(); });
      planetData.forEach(({ tex, mat }) => { tex.dispose(); mat.dispose(); });
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [size, colorMode]);

  return (
    <div
      ref={mountRef}
      style={{
        width: size,
        height: size,
        cursor: "grab",
        display: "inline-block",
        touchAction: "none",
        filter: "drop-shadow(0 0 14px rgba(160,160,210,0.45))",
      }}
    />
  );
};

export default MoonHero;
