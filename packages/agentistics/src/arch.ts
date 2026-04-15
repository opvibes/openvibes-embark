import * as THREE from "three";

// Data-flow neural-net visualization
// Layers: JSONL files → parser → aggregator → SSE → React UI
// Signal propagates left-to-right with amber/indigo color

interface Node3D {
  mesh: THREE.Mesh;
  layer: number;
  idx: number;
  baseColor: THREE.Color;
}

export function initArchCanvas(): void {
  const canvas = document.getElementById("arch-canvas") as HTMLCanvasElement | null;
  if (!canvas) return;

  const container = canvas.parentElement!;
  const w = container.clientWidth || 500;
  const h = container.clientHeight || 420;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 200);
  camera.position.set(0, 0, 28);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Layer structure: JSONL → parser → aggregator → API → React
  const layerSizes = [4, 6, 5, 4, 3];
  const layerColors = [
    new THREE.Color(0xD97706), // amber — raw files
    new THREE.Color(0xF59E0B), // amber light — parser
    new THREE.Color(0x6366f1), // indigo — aggregator
    new THREE.Color(0x10b981), // green — API
    new THREE.Color(0x06b6d4), // cyan — UI
  ];
  const layerLabels = ["~/.claude/", "parser", "aggregator", "API", "dashboard"];
  const LAYER_SPACING = 7.5;
  const totalWidth = (layerSizes.length - 1) * LAYER_SPACING;

  const nodes: Node3D[] = [];
  const nodePositions: THREE.Vector3[][] = [];

  // Build nodes
  for (let li = 0; li < layerSizes.length; li++) {
    const count = layerSizes[li]!;
    const x = li * LAYER_SPACING - totalWidth / 2;
    const layerNodes: THREE.Vector3[] = [];

    for (let ni = 0; ni < count; ni++) {
      const y = (ni - (count - 1) / 2) * 2.6;
      const pos = new THREE.Vector3(x, y, 0);
      layerNodes.push(pos);

      const geo = new THREE.SphereGeometry(0.32, 16, 16);
      const mat = new THREE.MeshBasicMaterial({
        color: layerColors[li]!,
        transparent: true, opacity: 0.75,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(pos);
      scene.add(mesh);

      // Outer glow ring
      const ringGeo = new THREE.RingGeometry(0.38, 0.5, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: layerColors[li]!,
        transparent: true, opacity: 0.18,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(pos);
      scene.add(ring);

      nodes.push({ mesh, layer: li, idx: ni, baseColor: layerColors[li]!.clone() });
    }
    nodePositions.push(layerNodes);
  }

  // Build connections between adjacent layers
  const connectionMeshes: THREE.Line[] = [];
  const connectionData: { fromLayer: number; fromIdx: number; toLayer: number; toIdx: number }[] = [];

  for (let li = 0; li < layerSizes.length - 1; li++) {
    const fromLayer = nodePositions[li]!;
    const toLayer   = nodePositions[li + 1]!;

    for (let fi = 0; fi < fromLayer.length; fi++) {
      for (let ti = 0; ti < toLayer.length; ti++) {
        // Skip some connections to keep it clean
        if (Math.random() < 0.35) continue;

        const pts = [fromLayer[fi]!, toLayer[ti]!];
        const geo = new THREE.BufferGeometry().setFromPoints(pts);
        const mat = new THREE.LineBasicMaterial({
          color: 0x444466,
          transparent: true, opacity: 0.12,
          blending: THREE.AdditiveBlending,
        });
        const line = new THREE.Line(geo, mat);
        scene.add(line);
        connectionMeshes.push(line);
        connectionData.push({ fromLayer: li, fromIdx: fi, toLayer: li + 1, toIdx: ti });
      }
    }
  }

  // ── Signal propagation ────────────────────────────────────
  // A "pulse" travels from layer 0 to layer N, lighting up connections

  interface Pulse {
    fromLayer: number;
    fromIdx: number;
    toLayer: number;
    toIdx: number;
    t: number; // 0..1
    color: THREE.Color;
  }

  const activePulses: Pulse[] = [];
  let signalFront = 0; // current front layer (0..layerSizes.length-1)
  let signalTimer = 0;
  const SIGNAL_INTERVAL = 18; // frames between new wave

  // Signal mesh — small sphere that travels along connections
  const pulseGeo = new THREE.SphereGeometry(0.18, 8, 8);

  function spawnWave(fromLayer: number) {
    const conns = connectionData.filter((c) => c.fromLayer === fromLayer);
    // Pick a random subset to light up
    const chosen = conns.filter(() => Math.random() < 0.7);
    for (const c of chosen) {
      const mat = new THREE.MeshBasicMaterial({
        color: layerColors[fromLayer + 1]!,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
      });
      const mesh = new THREE.Mesh(pulseGeo, mat);
      scene.add(mesh);
      activePulses.push({
        fromLayer: c.fromLayer, fromIdx: c.fromIdx,
        toLayer: c.toLayer, toIdx: c.toIdx,
        t: 0, color: layerColors[fromLayer + 1]!.clone(),
      });
      // Store mesh ref on pulse
      (activePulses[activePulses.length - 1] as Pulse & { mesh: THREE.Mesh }).mesh = mesh;
    }
  }

  // ── Animate ──────────────────────────────────────────────
  let frame = 0;

  function animate() {
    requestAnimationFrame(animate);
    frame++;

    // Spawn signal wave
    signalTimer++;
    if (signalTimer >= SIGNAL_INTERVAL) {
      signalTimer = 0;
      spawnWave(signalFront);
      signalFront = (signalFront + 1) % (layerSizes.length - 1);
    }

    // Update pulses
    for (let i = activePulses.length - 1; i >= 0; i--) {
      const p = activePulses[i] as Pulse & { mesh: THREE.Mesh };
      p.t += 0.035;

      if (p.t >= 1) {
        scene.remove(p.mesh);
        p.mesh.geometry.dispose();
        (p.mesh.material as THREE.Material).dispose();
        activePulses.splice(i, 1);

        // Light up destination node briefly
        const destNode = nodes.find((n) => n.layer === p.toLayer && n.idx === p.toIdx);
        if (destNode) {
          (destNode.mesh.material as THREE.MeshBasicMaterial).opacity = 1.0;
          (destNode.mesh.material as THREE.MeshBasicMaterial).color.set(0xffffff);
          setTimeout(() => {
            (destNode.mesh.material as THREE.MeshBasicMaterial).opacity = 0.75;
            (destNode.mesh.material as THREE.MeshBasicMaterial).color.copy(destNode.baseColor);
          }, 200);
        }
        continue;
      }

      // Interpolate position
      const from = nodePositions[p.fromLayer]![p.fromIdx]!;
      const to   = nodePositions[p.toLayer]![p.toIdx]!;
      p.mesh.position.lerpVectors(from, to, p.t);

      // Fade out near end
      (p.mesh.material as THREE.MeshBasicMaterial).opacity = 0.9 * (1 - p.t * 0.3);
    }

    // Gentle scene rotation — reduced amplitude to prevent node clipping
    scene.rotation.y = Math.sin(frame * 0.008) * 0.12;
    scene.rotation.x = Math.sin(frame * 0.005) * 0.06;

    renderer.render(scene, camera);
  }

  animate();

  // Resize
  const obs = new ResizeObserver(() => {
    const nw = container.clientWidth;
    const nh = container.clientHeight;
    camera.aspect = nw / nh;
    camera.updateProjectionMatrix();
    renderer.setSize(nw, nh);
  });
  obs.observe(container);
}
