import React, { useRef, useEffect } from 'react';

/**
 * AnimatedSceneCanvas
 * 
 * 60FPS HTML5 Canvas Motion-Graphics Video Engine
 * Renders continuous, cinematic educational animations:
 * - Real-time particle physics & moving energy/data packets
 * - Topic-specific procedural visualizers (Motherboard/CPU/RAM for OS, Photosynthesis photon rays/cells, 
 *   Water cycle rippling waves/rainfall, Networking HTTP packet flows, Tree algorithms, Universal gyroscopes)
 * - Dynamic spotlight highlighting the active concept in the current scene
 * - Crisp Retina/High-DPI scaling
 */
export function AnimatedSceneCanvas({ scene, isPlaying, speed = 1 }) {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const stateRef = useRef({
    particles: [],
    flowPackets: [],
    time: 0,
    activePhaseIndex: 0
  });

  // Initialize particles & animation state
  useEffect(() => {
    const ambientParticles = [];
    for (let i = 0; i < 40; i++) {
      ambientParticles.push({
        x: Math.random(),
        y: Math.random(),
        radius: Math.random() * 1.8 + 0.6,
        speedX: (Math.random() - 0.5) * 0.0003,
        speedY: (Math.random() - 0.5) * 0.0003,
        alpha: Math.random() * 0.5 + 0.2,
        twinkleSpeed: Math.random() * 0.03 + 0.01
      });
    }

    const packets = [];
    for (let i = 0; i < 18; i++) {
      packets.push({
        progress: Math.random(),
        pathIndex: Math.floor(Math.random() * 4),
        speed: Math.random() * 0.004 + 0.002,
        size: Math.random() * 3 + 2,
        color: i % 3 === 0 ? '#38bdf8' : i % 3 === 1 ? '#a855f7' : '#10b981'
      });
    }

    stateRef.current.particles = ambientParticles;
    stateRef.current.flowPackets = packets;
    stateRef.current.activePhaseIndex = scene?.index || 0;
  }, [scene?.title, scene?.category]);

  // Update active phase when scene changes
  useEffect(() => {
    stateRef.current.activePhaseIndex = scene?.index || 0;
  }, [scene?.index]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let lastTimestamp = performance.now();

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const render = (now) => {
      const delta = (now - lastTimestamp) * 0.001 * (isPlaying ? speed : 0.2);
      lastTimestamp = now;
      stateRef.current.time += delta;
      const t = stateRef.current.time;

      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const dpr = window.devicePixelRatio || 1;
      ctx.scale(dpr, dpr);

      // --- 1. Cinematic Background & Ambient Lighting ---
      const bgGrad = ctx.createRadialGradient(w * 0.5, h * 0.5, 20, w * 0.5, h * 0.5, w * 0.8);
      bgGrad.addColorStop(0, '#0c1322');
      bgGrad.addColorStop(0.6, '#070b14');
      bgGrad.addColorStop(1, '#02050b');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Cyber/Lab Grid Lines with animated glow waves
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Floating Ambient Starfield Dust
      stateRef.current.particles.forEach((p) => {
        p.x = (p.x + p.speedX * (isPlaying ? 1 : 0.3) + 1) % 1;
        p.y = (p.y + p.speedY * (isPlaying ? 1 : 0.3) + 1) % 1;
        const alpha = p.alpha + Math.sin(t * 3 + p.x * 10) * 0.15;
        ctx.fillStyle = `rgba(186, 230, 253, ${Math.max(0.1, alpha)})`;
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // --- 2. Topic-Specific Motion Graphics Engine ---
      const category = scene?.category || 'general';
      const activeIdx = stateRef.current.activePhaseIndex;
      const elements = scene?.elements || [];

      if (category === 'systems') {
        drawOperatingSystemEngine(ctx, w, h, t, activeIdx, isPlaying, elements, stateRef.current.flowPackets);
      } else if (category === 'nature') {
        if ((scene.pattern || '') === 'cycle') {
          drawWaterCycleEngine(ctx, w, h, t, activeIdx, isPlaying, elements);
        } else {
          drawPhotosynthesisEngine(ctx, w, h, t, activeIdx, isPlaying, elements);
        }
      } else if (category === 'network') {
        drawNetworkingEngine(ctx, w, h, t, activeIdx, isPlaying, elements, stateRef.current.flowPackets);
      } else if (category === 'algorithms') {
        drawAlgorithmTreeEngine(ctx, w, h, t, activeIdx, isPlaying, elements);
      } else {
        drawUniversalOrbitalEngine(ctx, w, h, t, activeIdx, isPlaying, elements, stateRef.current.flowPackets);
      }

      // --- 3. Cinema Letterbox Vignette Overlay ---
      const vignette = ctx.createRadialGradient(w * 0.5, h * 0.5, h * 0.4, w * 0.5, h * 0.5, w * 0.75);
      vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vignette.addColorStop(1, 'rgba(0, 0, 0, 0.65)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, w, h);

      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [scene, isPlaying, speed]);

  return (
    <div className="relative w-full aspect-video min-h-[340px] md:min-h-[400px] max-h-[520px] bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800/80">
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-pointer"
      />
    </div>
  );
}

// --------------------------------------------------------------------------------------
// 1. OPERATING SYSTEM & HARDWARE ENGINE (Motherboard, CPU, Bus, RAM, Storage)
// --------------------------------------------------------------------------------------
function drawOperatingSystemEngine(ctx, w, h, t, activeIdx, isPlaying, elements, packets) {
  // Nodes setup across the motherboard
  const nodes = [
    { id: 'apps', label: 'User & Apps', x: w * 0.16, y: h * 0.35, color: '#a855f7', icon: '📱' },
    { id: 'kernel', label: 'OS / Kernel', x: w * 0.36, y: h * 0.50, color: '#38bdf8', icon: '⚙️' },
    { id: 'cpu', label: 'CPU Processor', x: w * 0.60, y: h * 0.35, color: '#f59e0b', icon: '⚡' },
    { id: 'ram', label: 'RAM Memory', x: w * 0.84, y: h * 0.35, color: '#10b981', icon: '🗄️' },
    { id: 'disk', label: 'Storage Disk', x: w * 0.72, y: h * 0.75, color: '#06b6d4', icon: '💾' }
  ];

  // Draw motherboard copper/gold bus traces
  const buses = [
    { from: nodes[0], to: nodes[1] },
    { from: nodes[1], to: nodes[2] },
    { from: nodes[2], to: nodes[3] },
    { from: nodes[1], to: nodes[4] },
    { from: nodes[3], to: nodes[4] }
  ];

  buses.forEach((bus, i) => {
    ctx.beginPath();
    ctx.moveTo(bus.from.x, bus.from.y);
    // Draw stepped 90-degree circuit traces
    const midX = (bus.from.x + bus.to.x) * 0.5;
    ctx.lineTo(midX, bus.from.y);
    ctx.lineTo(midX, bus.to.y);
    ctx.lineTo(bus.to.x, bus.to.y);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Circuit track edge pins
    ctx.fillStyle = 'rgba(245, 158, 11, 0.4)';
    ctx.beginPath();
    ctx.arc(bus.from.x, bus.from.y, 4, 0, Math.PI * 2);
    ctx.arc(bus.to.x, bus.to.y, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  // Animate moving data bits / packets along the buses
  packets.forEach((pkt) => {
    pkt.progress = (pkt.progress + pkt.speed * (isPlaying ? 1.4 : 0.2)) % 1;
    const bus = buses[pkt.pathIndex % buses.length];
    const p = pkt.progress;

    let px, py;
    const midX = (bus.from.x + bus.to.x) * 0.5;
    if (p < 0.33) {
      const sub = p / 0.33;
      px = bus.from.x + (midX - bus.from.x) * sub;
      py = bus.from.y;
    } else if (p < 0.66) {
      const sub = (p - 0.33) / 0.33;
      px = midX;
      py = bus.from.y + (bus.to.y - bus.from.y) * sub;
    } else {
      const sub = (p - 0.66) / 0.34;
      px = midX + (bus.to.x - midX) * sub;
      py = bus.to.y;
    }

    // Glowing data packet head
    ctx.save();
    ctx.shadowColor = pkt.color;
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(px, py, pkt.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  // Draw nodes
  nodes.forEach((node, idx) => {
    const isSpotlight = idx === (activeIdx % nodes.length);
    drawMotherboardNode(ctx, node, isSpotlight, t);
  });
}

function drawMotherboardNode(ctx, node, isSpotlight, t) {
  const { x, y, label, color, icon } = node;
  const size = isSpotlight ? 48 : 38;

  // Spotlight outer aura
  if (isSpotlight) {
    const pulse = Math.sin(t * 5) * 6;
    ctx.save();
    ctx.shadowColor = color;
    ctx.shadowBlur = 24 + pulse;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(x, y, size + 10 + pulse, 0, Math.PI * 2);
    ctx.stroke();

    // Secondary ripple
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, size + 18 + pulse * 1.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // Node background disc/square
  ctx.save();
  ctx.fillStyle = '#0f172a';
  ctx.strokeStyle = isSpotlight ? color : 'rgba(148, 163, 184, 0.3)';
  ctx.lineWidth = isSpotlight ? 2.5 : 1.5;
  ctx.beginPath();
  drawRoundedRect(ctx, x - size, y - size, size * 2, size * 2, 14);
  ctx.fill();
  ctx.stroke();

  // Internal component glow
  const innerGrad = ctx.createRadialGradient(x, y, 5, x, y, size);
  innerGrad.addColorStop(0, color + '55');
  innerGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = innerGrad;
  ctx.fill();

  // Draw icon emoji or symbol
  ctx.font = `${isSpotlight ? 26 : 22}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(icon, x, y - 2);

  // Label banner below
  ctx.font = `bold ${isSpotlight ? 12 : 11}px Inter, sans-serif`;
  ctx.fillStyle = isSpotlight ? '#ffffff' : '#94a3b8';
  ctx.fillText(label, x, y + size + 16);

  if (isSpotlight) {
    ctx.font = 'bold 9px Inter, sans-serif';
    ctx.fillStyle = color;
    ctx.fillText('● ACTIVE PHASE', x, y + size + 28);
  }

  ctx.restore();
}

// --------------------------------------------------------------------------------------
// 2. PHOTOSYNTHESIS & BIOLOGY ENGINE (Sunlight, Leaf Cells, CO2, H2O, O2, Glucose)
// --------------------------------------------------------------------------------------
function drawPhotosynthesisEngine(ctx, w, h, t, activeIdx, isPlaying, elements) {
  // Sun in Top Left
  const sunX = w * 0.16;
  const sunY = h * 0.22;
  const sunRadius = 38 + Math.sin(t * 3) * 3;

  ctx.save();
  ctx.shadowColor = '#f59e0b';
  ctx.shadowBlur = 30;
  const sunGrad = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, sunRadius);
  sunGrad.addColorStop(0, '#fffbeb');
  sunGrad.addColorStop(0.5, '#fbbf24');
  sunGrad.addColorStop(1, 'rgba(217, 119, 6, 0.4)');
  ctx.fillStyle = sunGrad;
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Animated Sunlight Photon Beams pointing toward leaf
  const leafX = w * 0.52;
  const leafY = h * 0.52;

  for (let i = 0; i < 7; i++) {
    const angleOffset = (i - 3) * 0.08;
    const dx = leafX - sunX;
    const dy = leafY - sunY;
    const angle = Math.atan2(dy, dx) + angleOffset;

    ctx.save();
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.35)';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 12]);
    ctx.lineDashOffset = -t * 40;
    ctx.beginPath();
    ctx.moveTo(sunX + Math.cos(angle) * sunRadius, sunY + Math.sin(angle) * sunRadius);
    ctx.lineTo(leafX - 70 + (i * 18), leafY - 40);
    ctx.stroke();
    ctx.restore();
  }

  // Giant Plant Leaf Cell in Center
  ctx.save();
  ctx.shadowColor = '#10b981';
  ctx.shadowBlur = 20;
  ctx.fillStyle = 'rgba(6, 78, 59, 0.7)';
  ctx.strokeStyle = '#34d399';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(leafX, leafY, w * 0.22, h * 0.28, 0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Chloroplast organelles inside leaf
  const organellePositions = [
    { x: leafX - 45, y: leafY - 20 },
    { x: leafX + 35, y: leafY - 25 },
    { x: leafX - 20, y: leafY + 30 },
    { x: leafX + 40, y: leafY + 25 }
  ];

  organellePositions.forEach((pos, i) => {
    const pSize = 18 + Math.sin(t * 4 + i) * 2;
    ctx.fillStyle = '#059669';
    ctx.strokeStyle = '#6ee7b7';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(pos.x, pos.y, pSize, pSize * 0.65, i * 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });
  ctx.restore();

  // Incoming Water H2O molecules (rising from roots)
  for (let i = 0; i < 6; i++) {
    const p = (t * 0.3 + (i * 0.16)) % 1;
    const wx = leafX - 80 + (i * 20);
    const wy = h * 0.92 - p * (h * 0.4);
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(wx, wy, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = '9px sans-serif';
    ctx.fillStyle = '#bae6fd';
    ctx.fillText('H₂O', wx + 8, wy + 3);
  }

  // Incoming CO2 molecules (from left)
  for (let i = 0; i < 5; i++) {
    const p = (t * 0.25 + (i * 0.2)) % 1;
    const cx = w * 0.15 + p * (leafX - w * 0.15 - 50);
    const cy = leafY - 30 + Math.sin(p * 8) * 15;
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = '9px sans-serif';
    ctx.fillText('CO₂', cx - 8, cy - 8);
  }

  // Outgoing Synthesized Glucose & Oxygen (floating right)
  const outX = w * 0.84;
  const outY = leafY;

  // Glucose Sparkle Core
  ctx.save();
  ctx.shadowColor = '#facc15';
  ctx.shadowBlur = 18;
  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 12px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('✨ Glucose (Energy)', outX, outY - 25);
  ctx.fillStyle = '#2dd4bf';
  ctx.fillText('🫧 Oxygen (O₂ Released)', outX, outY + 25);
  ctx.restore();

  // Floating Oxygen bubbles
  for (let i = 0; i < 8; i++) {
    const p = (t * 0.35 + (i * 0.12)) % 1;
    const bx = leafX + 60 + p * (outX - leafX);
    const by = leafY + (i % 2 === 0 ? -1 : 1) * (20 + p * 35);
    ctx.strokeStyle = '#5eead4';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(bx, by, 4 + p * 3, 0, Math.PI * 2);
    ctx.stroke();
  }
}

// --------------------------------------------------------------------------------------
// 3. WATER CYCLE ENGINE (Ocean Waves, Solar Evaporation, Cloud, Rainfall)
// --------------------------------------------------------------------------------------
function drawWaterCycleEngine(ctx, w, h, t, activeIdx, isPlaying, elements) {
  // 1. Ocean Waves at Bottom
  const oceanY = h * 0.78;
  ctx.save();
  ctx.fillStyle = '#0369a1';
  ctx.beginPath();
  ctx.moveTo(0, h);
  ctx.lineTo(0, oceanY);
  for (let x = 0; x <= w; x += 15) {
    const wave = Math.sin(x * 0.02 + t * 4) * 8 + Math.cos(x * 0.04 - t * 2) * 4;
    ctx.lineTo(x, oceanY + wave);
  }
  ctx.lineTo(w, h);
  ctx.closePath();
  ctx.fill();

  // Water highlight shimmer
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  // 2. Rising Evaporation Vapor Particles
  for (let i = 0; i < 14; i++) {
    const p = (t * 0.28 + (i * 0.07)) % 1;
    const vx = w * 0.22 + (i % 5) * (w * 0.08) + Math.sin(p * 6 + i) * 12;
    const vy = oceanY - p * (oceanY - h * 0.28);
    ctx.fillStyle = `rgba(186, 230, 253, ${1 - p * 0.8})`;
    ctx.beginPath();
    ctx.arc(vx, vy, 3 + p * 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // 3. Drifting Condensation Clouds at Top
  const cloudX = w * 0.58 + Math.sin(t * 0.5) * 20;
  const cloudY = h * 0.26;

  ctx.save();
  ctx.shadowColor = '#94a3b8';
  ctx.shadowBlur = 25;
  ctx.fillStyle = '#e2e8f0';
  ctx.beginPath();
  ctx.arc(cloudX, cloudY, 36, 0, Math.PI * 2);
  ctx.arc(cloudX - 30, cloudY + 10, 26, 0, Math.PI * 2);
  ctx.arc(cloudX + 32, cloudY + 8, 28, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 4. Falling Raindrop Streaks
  for (let i = 0; i < 16; i++) {
    const p = (t * 0.75 + (i * 0.06)) % 1;
    const rx = cloudX - 35 + (i * 5) + Math.sin(i) * 10;
    const ry = cloudY + 25 + p * (oceanY - cloudY - 20);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(rx, ry);
    ctx.lineTo(rx - 2, ry + 12);
    ctx.stroke();
  }

  // Step Labels
  ctx.font = 'bold 12px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('1. Evaporation', w * 0.28, h * 0.55);
  ctx.fillStyle = '#cbd5e1';
  ctx.fillText('2. Condensation', cloudX, cloudY - 45);
  ctx.fillStyle = '#0ea5e9';
  ctx.fillText('3. Precipitation', cloudX + 15, h * 0.58);
}

// --------------------------------------------------------------------------------------
// 4. NETWORKING & HTTP ENGINE (Client Browser, Request/Response Packets, Server, DB)
// --------------------------------------------------------------------------------------
function drawNetworkingEngine(ctx, w, h, t, activeIdx, isPlaying, elements, packets) {
  const clientX = w * 0.18;
  const clientY = h * 0.5;
  const serverX = w * 0.62;
  const serverY = h * 0.5;
  const dbX = w * 0.86;
  const dbY = h * 0.5;

  // Fiber cables
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(clientX, clientY);
  ctx.lineTo(serverX, serverY);
  ctx.moveTo(serverX, serverY);
  ctx.lineTo(dbX, dbY);
  ctx.stroke();

  // Moving HTTP Request (Going right)
  const reqP = (t * 0.5) % 1;
  const rx = clientX + reqP * (serverX - clientX);
  ctx.save();
  ctx.shadowColor = '#f59e0b';
  ctx.shadowBlur = 12;
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  drawRoundedRect(ctx, rx - 18, clientY - 26, 36, 18, 5);
  ctx.fill();
  ctx.font = 'bold 9px Inter, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText('GET', rx, clientY - 14);
  ctx.restore();

  // Moving HTTP Response (Going left)
  const resP = (t * 0.45 + 0.5) % 1;
  const backX = serverX - resP * (serverX - clientX);
  ctx.save();
  ctx.shadowColor = '#10b981';
  ctx.shadowBlur = 12;
  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  drawRoundedRect(ctx, backX - 22, clientY + 10, 44, 18, 5);
  ctx.fill();
  ctx.font = 'bold 9px Inter, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText('200 OK', backX, clientY + 22);
  ctx.restore();

  // Client Machine Box
  drawDeviceCard(ctx, clientX, clientY, 'Web Browser', '💻', '#38bdf8', activeIdx === 0);
  // Server Rack Box
  drawDeviceCard(ctx, serverX, serverY, 'Web Server', '🖥️', '#a855f7', activeIdx === 1 || activeIdx === 2);
  // Database Cylinder
  drawDeviceCard(ctx, dbX, dbY, 'Database', '🗄️', '#10b981', activeIdx >= 3);
}

function drawDeviceCard(ctx, x, y, label, icon, color, isSpotlight) {
  const w = 84;
  const h = 76;
  ctx.save();
  if (isSpotlight) {
    ctx.shadowColor = color;
    ctx.shadowBlur = 24;
  }
  ctx.fillStyle = '#0f172a';
  ctx.strokeStyle = isSpotlight ? color : 'rgba(148, 163, 184, 0.3)';
  ctx.lineWidth = isSpotlight ? 2.5 : 1.5;
  ctx.beginPath();
  drawRoundedRect(ctx, x - w * 0.5, y - h * 0.5, w, h, 14);
  ctx.fill();
  ctx.stroke();

  ctx.font = '26px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(icon, x, y - 4);

  ctx.font = 'bold 11px Inter, sans-serif';
  ctx.fillStyle = isSpotlight ? '#ffffff' : '#94a3b8';
  ctx.fillText(label, x, y + 26);
  ctx.restore();
}

// --------------------------------------------------------------------------------------
// 5. ALGORITHMS & BINARY TREE ENGINE
// --------------------------------------------------------------------------------------
function drawAlgorithmTreeEngine(ctx, w, h, t, activeIdx, isPlaying, elements) {
  const treeNodes = [
    { id: 1, val: '50 (Root)', x: w * 0.5, y: h * 0.25 },
    { id: 2, val: '30', x: w * 0.32, y: h * 0.48 },
    { id: 3, val: '70', x: w * 0.68, y: h * 0.48 },
    { id: 4, val: '20', x: w * 0.22, y: h * 0.72 },
    { id: 5, val: '40 (Target)', x: w * 0.42, y: h * 0.72 }
  ];

  // Tree edges
  const edges = [
    [0, 1], [0, 2], [1, 3], [1, 4]
  ];

  edges.forEach(([u, v]) => {
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(treeNodes[u].x, treeNodes[u].y);
    ctx.lineTo(treeNodes[v].x, treeNodes[v].y);
    ctx.stroke();
  });

  // Search traversal highlight
  const targetNodeIdx = (activeIdx % 2 === 0) ? 1 : 4;

  treeNodes.forEach((node, i) => {
    const isTarget = i === targetNodeIdx;
    ctx.save();
    if (isTarget) {
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 20;
    }
    ctx.fillStyle = isTarget ? '#064e3b' : '#0f172a';
    ctx.strokeStyle = isTarget ? '#34d399' : '#64748b';
    ctx.lineWidth = isTarget ? 2.5 : 1.5;
    ctx.beginPath();
    ctx.arc(node.x, node.y, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.font = 'bold 10px Inter, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.val, node.x, node.y);
    ctx.restore();
  });
}

// --------------------------------------------------------------------------------------
// 6. UNIVERSAL ORBITAL GYROSCOPE (General Concepts Fallback)
// --------------------------------------------------------------------------------------
function drawUniversalOrbitalEngine(ctx, w, h, t, activeIdx, isPlaying, elements, packets) {
  const cx = w * 0.5;
  const cy = h * 0.5;

  // 3D-angled Gyroscopic Rings
  const ringCount = 3;
  for (let i = 0; i < ringCount; i++) {
    const angle = (i * Math.PI) / ringCount + t * (0.4 + i * 0.2);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.strokeStyle = i === 0 ? 'rgba(56, 189, 248, 0.4)' : i === 1 ? 'rgba(168, 85, 247, 0.4)' : 'rgba(16, 185, 129, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, w * 0.32, h * 0.22, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Orbiting Electron/Particle
    const orbAngle = t * 2 + (i * 1.5);
    const ox = Math.cos(orbAngle) * (w * 0.32);
    const oy = Math.sin(orbAngle) * (h * 0.22);
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 12;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(ox, oy, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Center Fusion Core
  ctx.save();
  ctx.shadowColor = '#6366f1';
  ctx.shadowBlur = 30;
  const coreGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, 40);
  coreGrad.addColorStop(0, '#ffffff');
  coreGrad.addColorStop(0.5, '#6366f1');
  coreGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = coreGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, 38, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Floating peripheral nodes
  const count = elements.length || 3;
  for (let i = 0; i < count; i++) {
    const rad = (i / count) * Math.PI * 2 + t * 0.2;
    const nx = cx + Math.cos(rad) * (w * 0.36);
    const ny = cy + Math.sin(rad) * (h * 0.32);
    const isSpotlight = i === (activeIdx % count);

    ctx.save();
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = isSpotlight ? '#38bdf8' : 'rgba(148, 163, 184, 0.3)';
    ctx.lineWidth = isSpotlight ? 2.5 : 1.5;
    ctx.beginPath();
    ctx.arc(nx, ny, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('💡', nx, ny);

    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.fillStyle = isSpotlight ? '#ffffff' : '#94a3b8';
    ctx.fillText(elements[i]?.label || `Step ${i + 1}`, nx, ny + 32);
    ctx.restore();
  }
}

/**
 * Utility helper to draw rounded rectangle safely
 */
function drawRoundedRect(ctx, x, y, width, height, radius) {
  if (ctx.roundRect) {
    ctx.roundRect(x, y, width, height, radius);
  } else {
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
  }
}

export default AnimatedSceneCanvas;
