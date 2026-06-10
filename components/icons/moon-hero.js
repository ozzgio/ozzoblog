import { useEffect, useRef } from "react";
import { useColorMode } from "@chakra-ui/react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// --- Canvas helper ---
function rRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// --- Planet icon draw functions (64×64 canvas, transparent bg) ---

function drawDumbbell(ctx, S) {
  const cx = S / 2, cy = S / 2, wR = S * 0.16, bH = S * 0.12, bW = S * 0.48;
  ctx.fillStyle = "#6b7280";
  ctx.fillRect(cx - bW / 2, cy - bH / 2, bW, bH);
  ctx.fillStyle = "#9ca3af";
  ctx.fillRect(cx - bW / 2 + 2, cy - bH / 2 + 2, bW - 4, bH * 0.38);
  [cx - bW / 2, cx + bW / 2].forEach((wx) => {
    ctx.fillStyle = "#374151";
    ctx.beginPath(); ctx.arc(wx, cy, wR, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.28)";
    ctx.beginPath(); ctx.arc(wx - wR * 0.32, cy - wR * 0.32, wR * 0.44, 0, Math.PI * 2); ctx.fill();
  });
}

function drawBook(ctx, S) {
  const p = S * 0.1;
  ctx.fillStyle = "#f0ebe0";
  ctx.fillRect(S * 0.56, p, S * 0.34, S - p * 2);
  ctx.fillStyle = "#c05a1f";
  ctx.fillRect(p, p, S * 0.52, S - p * 2);
  ctx.fillStyle = "#8b3610";
  ctx.fillRect(p, p, S * 0.1, S - p * 2);
  ctx.fillStyle = "#e0763a";
  ctx.fillRect(p + S * 0.1, S * 0.23, S * 0.42, S * 0.11);
  ctx.fillStyle = "#b0a898";
  [0, 1, 2, 3, 4].forEach((i) => {
    ctx.fillRect(S * 0.61, S * (0.27 + i * 0.1), i % 2 ? S * 0.14 : S * 0.18, S * 0.04);
  });
}

function drawBMW(ctx, S) {
  const cx = S / 2, cy = S / 2, R = S * 0.45, r = R * 0.76;
  ctx.fillStyle = "#111827";
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
  const quarters = [
    ["#1c69d4", -Math.PI / 2, 0],
    ["#f8f8f8", 0, Math.PI / 2],
    ["#1c69d4", Math.PI / 2, Math.PI],
    ["#f8f8f8", Math.PI, 3 * Math.PI / 2],
  ];
  quarters.forEach(([color, a1, a2]) => {
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r, a1, a2); ctx.closePath(); ctx.fill();
  });
  ctx.strokeStyle = "#111827";
  ctx.lineWidth = S * 0.046;
  ctx.beginPath(); ctx.moveTo(cx, cy - r); ctx.lineTo(cx, cy + r); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx - r, cy); ctx.lineTo(cx + r, cy); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
}

function drawTerminal(ctx, S) {
  const p = S * 0.08, rad = S * 0.1;
  ctx.fillStyle = "#0d1117";
  rRect(ctx, p, p, S - p * 2, S - p * 2, rad); ctx.fill();
  ctx.fillStyle = "#161b22";
  rRect(ctx, p, p, S - p * 2, S * 0.24, rad); ctx.fill();
  // Overwrite bottom corners of title bar so it connects to window body
  ctx.fillStyle = "#161b22";
  ctx.fillRect(p, p + S * 0.14, S - p * 2, S * 0.1);
  const dotY = p + S * 0.12, dotR = S * 0.044;
  [["#ff5f56", p + S * 0.13], ["#ffbd2e", p + S * 0.24], ["#27c93f", p + S * 0.35]].forEach(([c, x]) => {
    ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, dotY, dotR, 0, Math.PI * 2); ctx.fill();
  });
  ctx.fillStyle = "#00dd44";
  const cX = p + S * 0.1, cY = p + S * 0.32;
  [S * 0.52, S * 0.36, S * 0.54, S * 0.28].forEach((w, i) => {
    ctx.fillRect(cX, cY + i * S * 0.13, w, S * 0.055);
  });
}

function drawPencil(ctx, S) {
  ctx.save();
  ctx.translate(S * 0.5, S * 0.5);
  ctx.rotate(-Math.PI * 0.3);
  const bw = S * 0.18, bh = S * 0.52;
  // eraser (pink top)
  ctx.fillStyle = "#f4a0a0";
  ctx.fillRect(-bw / 2, -bh * 0.5, bw, bh * 0.1);
  // metal ferrule band
  ctx.fillStyle = "#c0c0c0";
  ctx.fillRect(-bw / 2, -bh * 0.4, bw, bh * 0.06);
  // yellow body
  ctx.fillStyle = "#f5c518";
  ctx.fillRect(-bw / 2, -bh * 0.34, bw, bh * 0.6);
  // highlight stripe
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.fillRect(-bw * 0.35, -bh * 0.34, bw * 0.18, bh * 0.6);
  // wood tip (short cone)
  ctx.fillStyle = "#d4a96a";
  ctx.beginPath();
  ctx.moveTo(-bw / 2, bh * 0.26); ctx.lineTo(bw / 2, bh * 0.26); ctx.lineTo(0, bh * 0.42);
  ctx.closePath(); ctx.fill();
  // graphite point
  ctx.fillStyle = "#333";
  ctx.beginPath();
  ctx.moveTo(-bw * 0.18, bh * 0.38); ctx.lineTo(bw * 0.18, bh * 0.38); ctx.lineTo(0, bh * 0.5);
  ctx.closePath(); ctx.fill();
  ctx.restore();
}

function drawHeart(ctx, S) {
  // ♥ (U+2665, BLACK HEART SUIT) — plain text glyph, respects fillStyle
  ctx.fillStyle = "#e04060";
  ctx.font = `bold ${Math.round(S * 0.72)}px Georgia, "Times New Roman", serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("♥", S * 0.5, S * 0.54);
}

function drawCoffee(ctx, S) {
  const cx = S * 0.47;
  ctx.fillStyle = "#e8d8c4";
  ctx.beginPath();
  ctx.ellipse(cx, S * 0.82, S * 0.29, S * 0.065, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f0e4d0";
  ctx.beginPath();
  ctx.moveTo(cx - S * 0.22, S * 0.34);
  ctx.lineTo(cx + S * 0.22, S * 0.34);
  ctx.lineTo(cx + S * 0.17, S * 0.76);
  ctx.lineTo(cx - S * 0.17, S * 0.76);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#5c3d2e";
  ctx.beginPath();
  ctx.ellipse(cx, S * 0.35, S * 0.21, S * 0.062, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#e0d0b8";
  ctx.lineWidth = S * 0.07;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(cx + S * 0.27, S * 0.55, S * 0.11, -Math.PI * 0.5, Math.PI * 0.5);
  ctx.stroke();
  ctx.strokeStyle = "rgba(220,220,220,0.5)";
  ctx.lineWidth = S * 0.038;
  for (let i = 0; i < 3; i++) {
    const sx = cx - S * 0.09 + i * S * 0.09;
    ctx.beginPath();
    ctx.moveTo(sx, S * 0.24);
    ctx.bezierCurveTo(sx - S * 0.04, S * 0.17, sx + S * 0.04, S * 0.11, sx, S * 0.05);
    ctx.stroke();
  }
}

// --- Emissive map: "ozzo's blog" two-line text with glow ---
function buildSphereEmissiveMap() {
  const W = 512, H = 512;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, W, H);
  const cx = W / 2, cy = H / 2;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "bold 58px Georgia, 'Times New Roman', serif";
  const lines = [{ text: "ozzo's", y: cy - 42 }, { text: "blog", y: cy + 42 }];
  // subtle glow — keep blur small so serif details stay sharp
  ctx.shadowColor = "rgba(130,190,255,0.9)";
  ctx.shadowBlur = 6;
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  lines.forEach(({ text, y }) => ctx.fillText(text, cx, y));
  // crisp white text on top
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#ffffff";
  lines.forEach(({ text, y }) => ctx.fillText(text, cx, y));
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

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const key = new THREE.DirectionalLight(0xc8d8f0, 2.0);
    key.position.set(2, 1.5, 3);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x303858, 0.5);
    fill.position.set(-2, -1, 1);
    scene.add(fill);

    // Group wrapping the whole solar system — used for X-axis tilt animation
    const systemGroup = new THREE.Group();
    scene.add(systemGroup);

    // Central sphere — dark base color + self-lit "ozzo" via emissiveMap
    const sphereGeo = new THREE.SphereGeometry(1, 64, 64);
    const zEmissiveTex = new THREE.CanvasTexture(buildSphereEmissiveMap());
    zEmissiveTex.colorSpace = THREE.SRGBColorSpace;
    const sphereMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#3a4252"),
      emissiveMap: zEmissiveTex,
      emissive: new THREE.Color(1, 1, 1),
      emissiveIntensity: 0.82,
      roughness: 0.82,
      metalness: 0.06,
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
      [drawBMW,      2.02, 1.1,               0.32],
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
      if (!isInteracting) {
        elapsed += delta;
        // Y rotation always on — ~18 s per orbit regardless of reduced-motion
        systemGroup.rotation.y += 0.35 * delta;
        // X tilt only when motion is preferred: ±22° over ~10 s cycle
        if (!prefersReducedMotion) {
          systemGroup.rotation.x = Math.sin(elapsed * 0.32) * 0.38;
        }
      }
      planetData.forEach((p) => {
        p.angle += p.speed * delta;
        p.sprite.position.set(Math.cos(p.angle) * p.rad, 0, Math.sin(p.angle) * p.rad);
      });
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      controls.removeEventListener("start", onStart);
      controls.removeEventListener("end", onEnd);
      controls.dispose();
      sphereGeo.dispose();
      sphereMat.dispose();
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
