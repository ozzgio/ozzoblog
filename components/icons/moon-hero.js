import { useEffect, useRef } from "react";
import { useColorMode } from "@chakra-ui/react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

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
  const { cx, cy, r } = drawBadgeBase(ctx, S, "#374151");
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
  const { cx, cy, r } = drawBadgeBase(ctx, S, "#0d1117");
  ctx.strokeStyle = "#22c55e";
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
  const { cx, cy, r } = drawBadgeBase(ctx, S, "#1f2937");
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
  const { cx, cy, r } = drawBadgeBase(ctx, S, "#1f2937");
  ctx.fillStyle = "#ef4444";
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
