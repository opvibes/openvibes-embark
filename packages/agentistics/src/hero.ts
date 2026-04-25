import * as THREE from "three";

// Token particle stream — background canvas
// Particles drift upward like tokens being processed;
// color palette: amber (primary) + indigo (secondary) + emerald (success)

export function initHeroCanvas(): void {
  const canvas = document.getElementById("hero-canvas") as HTMLCanvasElement | null;
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.z = 55;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // ── Token particles (ambient drift) ─────────────────────
  const COUNT = 500;
  const pos = new Float32Array(COUNT * 3);
  const vel = new Float32Array(COUNT * 3);
  const col = new Float32Array(COUNT * 3);
  const sz  = new Float32Array(COUNT);

  // Palette: anthropic amber, indigo, emerald — exact agentistics colors
  const palette = [
    new THREE.Color(0xD97706), // amber (primary)
    new THREE.Color(0xF59E0B), // amber light
    new THREE.Color(0x6366f1), // indigo
    new THREE.Color(0x10b981), // emerald
    new THREE.Color(0x06b6d4), // cyan
  ];
  const weights = [0.35, 0.25, 0.25, 0.10, 0.05]; // amber-heavy

  function weightedColor(): THREE.Color {
    const r = Math.random();
    let acc = 0;
    for (let i = 0; i < weights.length; i++) {
      acc += weights[i]!;
      if (r < acc) return palette[i]!;
    }
    return palette[0]!;
  }

  for (let i = 0; i < COUNT; i++) {
    pos[i * 3]     = (Math.random() - 0.5) * 140;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 100;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 60;

    vel[i * 3]     = (Math.random() - 0.5) * 0.015;
    vel[i * 3 + 1] = Math.random() * 0.025 + 0.008; // drift upward
    vel[i * 3 + 2] = (Math.random() - 0.5) * 0.005;

    const c = weightedColor();
    col[i * 3]     = c.r;
    col[i * 3 + 1] = c.g;
    col[i * 3 + 2] = c.b;

    sz[i] = Math.random() * 2 + 0.4;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("color",    new THREE.BufferAttribute(col, 3));
  geo.setAttribute("size",     new THREE.BufferAttribute(sz, 1));

  const mat = new THREE.PointsMaterial({
    size: 1.2, vertexColors: true,
    transparent: true, opacity: 0.55,
    blending: THREE.AdditiveBlending,
    depthWrite: false, sizeAttenuation: true,
  });

  const points = new THREE.Points(geo, mat);
  scene.add(points);

  // ── Connection lines (sparse token graph) ────────────────
  const linePts: number[] = [];
  const lineCols: number[] = [];
  const CONNECT_DIST = 16;

  // Sample subset for performance
  const sample = 80;
  for (let i = 0; i < sample; i++) {
    for (let j = i + 1; j < sample; j++) {
      const dx = pos[i*3]! - pos[j*3]!;
      const dy = pos[i*3+1]! - pos[j*3+1]!;
      const dz = pos[i*3+2]! - pos[j*3+2]!;
      const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
      if (dist < CONNECT_DIST) {
        linePts.push(pos[i*3]!, pos[i*3+1]!, pos[i*3+2]!,
                     pos[j*3]!, pos[j*3+1]!, pos[j*3+2]!);
        // amber tint for connections
        lineCols.push(0.85, 0.47, 0.03,  0.85, 0.47, 0.03);
      }
    }
  }

  if (linePts.length > 0) {
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePts, 3));
    lineGeo.setAttribute("color",    new THREE.Float32BufferAttribute(lineCols, 3));
    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true, transparent: true, opacity: 0.08,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    scene.add(new THREE.LineSegments(lineGeo, lineMat));
  }

  // ── Mouse parallax ────────────────────────────────────────
  let mx = 0, my = 0;
  window.addEventListener("mousemove", (e) => {
    mx = (e.clientX / window.innerWidth  - 0.5) * 2;
    my = -(e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  // ── Animate ──────────────────────────────────────────────
  const posAttr = geo.getAttribute("position") as THREE.BufferAttribute;

  function animate() {
    requestAnimationFrame(animate);

    for (let i = 0; i < COUNT; i++) {
      posAttr.setX(i, posAttr.getX(i) + vel[i*3]!);
      posAttr.setY(i, posAttr.getY(i) + vel[i*3+1]!);
      posAttr.setZ(i, posAttr.getZ(i) + vel[i*3+2]!);

      // Wrap top → bottom
      if (posAttr.getY(i) > 52) {
        posAttr.setY(i, -52);
        posAttr.setX(i, (Math.random() - 0.5) * 140);
      }
      // Wrap X
      if (posAttr.getX(i) > 72) posAttr.setX(i, -72);
      if (posAttr.getX(i) < -72) posAttr.setX(i, 72);
    }
    posAttr.needsUpdate = true;

    // Gentle parallax
    camera.position.x += (mx * 6 - camera.position.x) * 0.03;
    camera.position.y += (my * 4 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
