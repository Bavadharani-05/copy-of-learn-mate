/**
 * visualObjects.js
 * 
 * Reusable 2D Educational Visual Objects Library for LearnMate.
 * Procedural HTML5 Canvas renderers for 30+ core educational objects,
 * plus a sophisticated universal generic fallback renderer for any arbitrary concept.
 */

// Helper to draw rounded rectangle
function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

export const VISUAL_OBJECTS = {
  // ==========================================
  // NATURE & BIOLOGY
  // ==========================================
  sun: {
    category: "nature",
    color: "#f59e0b",
    glowColor: "rgba(245, 158, 11, 0.6)",
    label: "Sun",
    draw(ctx, x, y, size = 60, state = {}) {
      const t = state.time || 0;
      const pulse = 1 + Math.sin(t * 3) * 0.06;
      const r = (size * 0.38) * pulse;

      // Outer Corona Glow
      const grad = ctx.createRadialGradient(x, y, r * 0.5, x, y, r * 2.2);
      grad.addColorStop(0, "rgba(251, 191, 36, 0.6)");
      grad.addColorStop(0.5, "rgba(245, 158, 11, 0.2)");
      grad.addColorStop(1, "rgba(245, 158, 11, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, r * 2.2, 0, Math.PI * 2);
      ctx.fill();

      // Radiating Sun Rays
      const rayCount = 12;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(t * 0.4);
      ctx.strokeStyle = "rgba(252, 211, 77, 0.7)";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      for (let i = 0; i < rayCount; i++) {
        const angle = (i * Math.PI * 2) / rayCount;
        const rayLen = r * 1.35 + Math.sin(t * 4 + i) * 5;
        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * (r * 1.1), Math.sin(angle) * (r * 1.1));
        ctx.lineTo(Math.cos(angle) * rayLen, Math.sin(angle) * rayLen);
        ctx.stroke();
      }
      ctx.restore();

      // Core Sun Sphere
      const coreGrad = ctx.createRadialGradient(x - r * 0.2, y - r * 0.2, r * 0.1, x, y, r);
      coreGrad.addColorStop(0, "#fffbeb");
      coreGrad.addColorStop(0.4, "#fde047");
      coreGrad.addColorStop(0.9, "#f59e0b");
      coreGrad.addColorStop(1, "#d97706");
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  },

  plant: {
    category: "nature",
    color: "#10b981",
    glowColor: "rgba(16, 185, 129, 0.5)",
    label: "Plant",
    draw(ctx, x, y, size = 60, state = {}) {
      const t = state.time || 0;
      const sway = Math.sin(t * 2) * 0.08;

      ctx.save();
      ctx.translate(x, y + size * 0.4);
      ctx.rotate(sway);

      // Main Stem
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(-size * 0.1, -size * 0.4, 0, -size * 0.75);
      ctx.strokeStyle = "#059669";
      ctx.lineWidth = 5;
      ctx.lineCap = "round";
      ctx.stroke();

      // Left Leaf
      ctx.beginPath();
      ctx.moveTo(-2, -size * 0.35);
      ctx.bezierCurveTo(-size * 0.45, -size * 0.55, -size * 0.35, -size * 0.2, 0, -size * 0.3);
      ctx.fillStyle = "#10b981";
      ctx.fill();
      ctx.strokeStyle = "#34d399";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Right Leaf
      ctx.beginPath();
      ctx.moveTo(1, -size * 0.5);
      ctx.bezierCurveTo(size * 0.45, -size * 0.7, size * 0.35, -size * 0.35, 0, -size * 0.45);
      ctx.fillStyle = "#34d399";
      ctx.fill();
      ctx.stroke();

      // Top Bud / Flower
      ctx.beginPath();
      ctx.arc(0, -size * 0.75, size * 0.14, 0, Math.PI * 2);
      ctx.fillStyle = "#6ee7b7";
      ctx.fill();

      ctx.restore();
    }
  },

  leaf: {
    category: "nature",
    color: "#34d399",
    glowColor: "rgba(52, 211, 153, 0.6)",
    label: "Leaf",
    draw(ctx, x, y, size = 55, state = {}) {
      const t = state.time || 0;
      const pulse = 1 + Math.sin(t * 2.5) * 0.05;
      const w = size * 0.45 * pulse;
      const h = size * 0.75 * pulse;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.sin(t * 1.5) * 0.1);

      // Leaf Blade
      ctx.beginPath();
      ctx.moveTo(0, -h * 0.5);
      ctx.bezierCurveTo(w, -h * 0.3, w, h * 0.3, 0, h * 0.5);
      ctx.bezierCurveTo(-w, h * 0.3, -w, -h * 0.3, 0, -h * 0.5);
      const grad = ctx.createLinearGradient(0, -h * 0.5, 0, h * 0.5);
      grad.addColorStop(0, "#34d399");
      grad.addColorStop(1, "#059669");
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.strokeStyle = "rgba(110, 231, 183, 0.8)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Leaf Veins
      ctx.beginPath();
      ctx.moveTo(0, -h * 0.45);
      ctx.lineTo(0, h * 0.45);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.restore();
    }
  },

  tree: {
    category: "nature",
    color: "#059669",
    glowColor: "rgba(5, 150, 105, 0.5)",
    label: "Tree",
    draw(ctx, x, y, size = 65, state = {}) {
      const t = state.time || 0;
      const sway = Math.sin(t * 1.5) * 0.04;

      ctx.save();
      ctx.translate(x, y);

      // Trunk
      ctx.fillStyle = "#78350f";
      ctx.fillRect(-size * 0.08, 0, size * 0.16, size * 0.45);

      // Foliage Layers with slight sway
      ctx.save();
      ctx.rotate(sway);
      const layers = [
        { y: -size * 0.05, r: size * 0.38, c: "#047857" },
        { y: -size * 0.25, r: size * 0.32, c: "#059669" },
        { y: -size * 0.42, r: size * 0.24, c: "#10b981" }
      ];
      layers.forEach(l => {
        ctx.beginPath();
        ctx.arc(0, l.y, l.r, 0, Math.PI * 2);
        ctx.fillStyle = l.c;
        ctx.fill();
        ctx.strokeStyle = "rgba(52, 211, 153, 0.3)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });
      ctx.restore();

      ctx.restore();
    }
  },

  water: {
    category: "nature",
    color: "#38bdf8",
    glowColor: "rgba(56, 189, 248, 0.6)",
    label: "Water",
    draw(ctx, x, y, size = 50, state = {}) {
      const t = state.time || 0;
      const bob = Math.sin(t * 3) * 4;

      ctx.save();
      ctx.translate(x, y + bob);

      // Teardrop / Water Drop
      const w = size * 0.35;
      const h = size * 0.55;
      ctx.beginPath();
      ctx.moveTo(0, -h * 0.55);
      ctx.bezierCurveTo(w, -h * 0.1, w * 1.1, h * 0.45, 0, h * 0.45);
      ctx.bezierCurveTo(-w * 1.1, h * 0.45, -w, -h * 0.1, 0, -h * 0.55);

      const grad = ctx.createRadialGradient(w * 0.2, -h * 0.1, 2, 0, 0, h * 0.6);
      grad.addColorStop(0, "#e0f2fe");
      grad.addColorStop(0.3, "#38bdf8");
      grad.addColorStop(1, "#0284c7");
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Specular shine
      ctx.beginPath();
      ctx.arc(-w * 0.3, -h * 0.15, w * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.fill();

      ctx.restore();
    }
  },

  cloud: {
    category: "nature",
    color: "#94a3b8",
    glowColor: "rgba(148, 163, 184, 0.4)",
    label: "Cloud",
    draw(ctx, x, y, size = 60, state = {}) {
      const t = state.time || 0;
      const drift = Math.sin(t * 1.2) * 5;

      ctx.save();
      ctx.translate(x + drift, y);

      ctx.fillStyle = "rgba(203, 213, 225, 0.9)";
      ctx.beginPath();
      ctx.arc(-size * 0.2, 0, size * 0.22, 0, Math.PI * 2);
      ctx.arc(size * 0.15, -size * 0.05, size * 0.28, 0, Math.PI * 2);
      ctx.arc(size * 0.38, size * 0.05, size * 0.18, 0, Math.PI * 2);
      ctx.arc(0, size * 0.12, size * 0.24, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  },

  soil: {
    category: "nature",
    color: "#a16207",
    glowColor: "rgba(161, 98, 7, 0.4)",
    label: "Soil / Roots",
    draw(ctx, x, y, size = 65, state = {}) {
      ctx.save();
      ctx.translate(x, y);

      // Soil Layer
      ctx.fillStyle = "#451a03";
      drawRoundedRect(ctx, -size * 0.5, -size * 0.2, size, size * 0.45, 8);
      ctx.fill();
      ctx.strokeStyle = "#78350f";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Root lines branching
      ctx.strokeStyle = "#b45309";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-size * 0.2, -size * 0.15);
      ctx.lineTo(-size * 0.3, size * 0.1);
      ctx.moveTo(0, -size * 0.15);
      ctx.lineTo(size * 0.1, size * 0.15);
      ctx.moveTo(size * 0.25, -size * 0.15);
      ctx.lineTo(size * 0.2, size * 0.08);
      ctx.stroke();

      ctx.restore();
    }
  },

  molecule: {
    category: "nature",
    color: "#ec4899",
    glowColor: "rgba(236, 72, 153, 0.5)",
    label: "Molecule",
    draw(ctx, x, y, size = 55, state = {}) {
      const t = state.time || 0;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(t * 0.8);

      const nodes = [
        { x: 0, y: 0, r: 12, c: "#f43f5e" },
        { x: size * 0.35, y: -size * 0.2, r: 8, c: "#38bdf8" },
        { x: -size * 0.35, y: -size * 0.2, r: 8, c: "#38bdf8" },
        { x: 0, y: size * 0.35, r: 9, c: "#a855f7" }
      ];

      // Bonds
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 3;
      nodes.slice(1).forEach(n => {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(n.x, n.y);
        ctx.stroke();
      });

      // Atoms
      nodes.forEach(n => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.c;
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      ctx.restore();
    }
  },

  atom: {
    category: "nature",
    color: "#06b6d4",
    glowColor: "rgba(6, 182, 212, 0.6)",
    label: "Atom",
    draw(ctx, x, y, size = 55, state = {}) {
      const t = state.time || 0;
      ctx.save();
      ctx.translate(x, y);

      // Nucleus
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.18, 0, Math.PI * 2);
      ctx.fillStyle = "#ec4899";
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Electron Orbits
      const orbits = [0, Math.PI / 3, (Math.PI * 2) / 3];
      ctx.strokeStyle = "rgba(6, 182, 212, 0.5)";
      ctx.lineWidth = 1.5;

      orbits.forEach((angle, idx) => {
        ctx.save();
        ctx.rotate(angle + t * 0.2);
        ctx.beginPath();
        ctx.ellipse(0, 0, size * 0.48, size * 0.18, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Orbiting electron
        const eAngle = t * 4 + idx * 2;
        const ex = Math.cos(eAngle) * size * 0.48;
        const ey = Math.sin(eAngle) * size * 0.18;
        ctx.beginPath();
        ctx.arc(ex, ey, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = "#38bdf8";
        ctx.fill();
        ctx.restore();
      });

      ctx.restore();
    }
  },

  // ==========================================
  // COMPUTING & NETWORKING
  // ==========================================
  computer: {
    category: "computing",
    color: "#38bdf8",
    glowColor: "rgba(56, 189, 248, 0.6)",
    label: "Computer",
    draw(ctx, x, y, size = 60, state = {}) {
      const t = state.time || 0;
      ctx.save();
      ctx.translate(x, y);

      const w = size * 0.85;
      const h = size * 0.55;

      // Monitor Screen Frame
      ctx.fillStyle = "#0f172a";
      drawRoundedRect(ctx, -w * 0.5, -h * 0.7, w, h, 6);
      ctx.fill();
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Inner Display with animated wave/terminal
      ctx.fillStyle = "rgba(14, 165, 233, 0.15)";
      drawRoundedRect(ctx, -w * 0.44, -h * 0.64, w * 0.88, h * 0.82, 3);
      ctx.fill();

      // Terminal Code Lines
      ctx.fillStyle = "#38bdf8";
      ctx.fillRect(-w * 0.35, -h * 0.45, w * 0.4, 2);
      ctx.fillRect(-w * 0.35, -h * 0.25, w * 0.55, 2);
      ctx.fillRect(-w * 0.35, -h * 0.05, w * 0.3, 2);

      // Blinking Cursor
      if (Math.floor(t * 4) % 2 === 0) {
        ctx.fillStyle = "#22d3ee";
        ctx.fillRect(-w * 0.35 + w * 0.33, -h * 0.08, 4, 6);
      }

      // Stand Base
      ctx.fillStyle = "#334155";
      ctx.fillRect(-size * 0.06, -h * 0.7 + h, size * 0.12, size * 0.15);
      drawRoundedRect(ctx, -size * 0.25, -h * 0.7 + h + size * 0.12, size * 0.5, size * 0.06, 2);
      ctx.fill();

      ctx.restore();
    }
  },

  server: {
    category: "computing",
    color: "#a855f7",
    glowColor: "rgba(168, 85, 247, 0.6)",
    label: "Server",
    draw(ctx, x, y, size = 60, state = {}) {
      const t = state.time || 0;
      ctx.save();
      ctx.translate(x, y);

      const w = size * 0.7;
      const h = size * 0.8;

      // Server Rack Body
      ctx.fillStyle = "#090d16";
      drawRoundedRect(ctx, -w * 0.5, -h * 0.5, w, h, 6);
      ctx.fill();
      ctx.strokeStyle = "#a855f7";
      ctx.lineWidth = 2;
      ctx.stroke();

      // 3 Server Blades
      const bladeH = (h - 20) / 3;
      for (let i = 0; i < 3; i++) {
        const by = -h * 0.5 + 6 + i * (bladeH + 4);
        ctx.fillStyle = "#1e1b4b";
        drawRoundedRect(ctx, -w * 0.42, by, w * 0.84, bladeH, 3);
        ctx.fill();

        // Ventilation Slots
        ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
        ctx.fillRect(-w * 0.3, by + bladeH * 0.45, w * 0.35, 2);

        // Blinking Status LEDs
        const ledOn = Math.sin(t * 5 + i * 2) > 0;
        ctx.beginPath();
        ctx.arc(w * 0.25, by + bladeH * 0.5, 3, 0, Math.PI * 2);
        ctx.fillStyle = ledOn ? (i === 0 ? "#10b981" : i === 1 ? "#38bdf8" : "#f59e0b") : "#334155";
        ctx.fill();
      }

      ctx.restore();
    }
  },

  router: {
    category: "computing",
    color: "#6366f1",
    glowColor: "rgba(99, 102, 241, 0.6)",
    label: "Router",
    draw(ctx, x, y, size = 55, state = {}) {
      const t = state.time || 0;
      ctx.save();
      ctx.translate(x, y);

      const w = size * 0.8;
      const h = size * 0.35;

      // Antennas
      ctx.strokeStyle = "#818cf8";
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      [-w * 0.3, 0, w * 0.3].forEach(ax => {
        ctx.beginPath();
        ctx.moveTo(ax, -h * 0.4);
        ctx.lineTo(ax, -h * 0.4 - size * 0.3);
        ctx.stroke();

        // Wireless radiation waves
        const waveR = (size * 0.15 + (t * 20) % (size * 0.35));
        const alpha = Math.max(0, 1 - waveR / (size * 0.35));
        ctx.strokeStyle = `rgba(129, 140, 248, ${alpha})`;
        ctx.beginPath();
        ctx.arc(ax, -h * 0.4 - size * 0.3, waveR, -Math.PI * 0.8, -Math.PI * 0.2);
        ctx.stroke();
      });

      // Router Body
      ctx.fillStyle = "#1e1b4b";
      drawRoundedRect(ctx, -w * 0.5, -h * 0.4, w, h, 6);
      ctx.fill();
      ctx.strokeStyle = "#6366f1";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Ethernet Ports & LED indicators
      for (let i = 0; i < 4; i++) {
        const lx = -w * 0.3 + i * (w * 0.2);
        ctx.beginPath();
        ctx.arc(lx, -h * 0.4 + h * 0.55, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = (Math.sin(t * 6 + i) > 0) ? "#22c55e" : "#4338ca";
        ctx.fill();
      }

      ctx.restore();
    }
  },

  database: {
    category: "computing",
    color: "#10b981",
    glowColor: "rgba(16, 185, 129, 0.6)",
    label: "Database",
    draw(ctx, x, y, size = 55, state = {}) {
      ctx.save();
      ctx.translate(x, y);

      const w = size * 0.7;
      const h = size * 0.75;
      const layerH = h / 3;

      for (let i = 0; i < 3; i++) {
        const ly = -h * 0.5 + i * layerH;
        ctx.fillStyle = i === 1 ? "#064e3b" : "#022c22";
        ctx.strokeStyle = "#10b981";
        ctx.lineWidth = 2;

        // Cylinder body
        ctx.beginPath();
        ctx.ellipse(0, ly + layerH * 0.6, w * 0.5, layerH * 0.3, 0, 0, Math.PI);
        ctx.lineTo(-w * 0.5, ly);
        ctx.ellipse(0, ly, w * 0.5, layerH * 0.3, 0, Math.PI, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Data LED
        ctx.beginPath();
        ctx.arc(w * 0.3, ly + layerH * 0.4, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "#34d399";
        ctx.fill();
      }

      ctx.restore();
    }
  },

  packet: {
    category: "computing",
    color: "#f59e0b",
    glowColor: "rgba(245, 158, 11, 0.7)",
    label: "Packet",
    draw(ctx, x, y, size = 45, state = {}) {
      const t = state.time || 0;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.sin(t * 2) * 0.1);

      const w = size * 0.75;
      const h = size * 0.55;

      // Envelope / Packet Card
      ctx.fillStyle = "#78350f";
      drawRoundedRect(ctx, -w * 0.5, -h * 0.5, w, h, 4);
      ctx.fill();
      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Envelope fold / data lines
      ctx.beginPath();
      ctx.moveTo(-w * 0.5, -h * 0.5);
      ctx.lineTo(0, 0);
      ctx.lineTo(w * 0.5, -h * 0.5);
      ctx.strokeStyle = "rgba(251, 191, 36, 0.6)";
      ctx.stroke();

      // Glowing Data Payload Bit
      ctx.beginPath();
      ctx.arc(0, h * 0.15, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = "#fef08a";
      ctx.fill();

      ctx.restore();
    }
  },

  cpu: {
    category: "computing",
    color: "#ef4444",
    glowColor: "rgba(239, 68, 68, 0.6)",
    label: "CPU",
    draw(ctx, x, y, size = 55, state = {}) {
      const t = state.time || 0;
      ctx.save();
      ctx.translate(x, y);

      const s = size * 0.65;

      // Gold pins around perimeter
      ctx.fillStyle = "#fbbf24";
      const pinCount = 4;
      for (let i = 0; i < pinCount; i++) {
        const offset = -s * 0.35 + i * (s * 0.24);
        ctx.fillRect(offset, -s * 0.55, 3, 5);
        ctx.fillRect(offset, s * 0.45, 3, 5);
        ctx.fillRect(-s * 0.55, offset, 5, 3);
        ctx.fillRect(s * 0.45, offset, 5, 3);
      }

      // Silicon Die
      ctx.fillStyle = "#18181b";
      drawRoundedRect(ctx, -s * 0.5, -s * 0.5, s, s, 4);
      ctx.fill();
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Pulsing Core
      const corePulse = 1 + Math.sin(t * 6) * 0.1;
      ctx.fillStyle = "rgba(239, 68, 68, 0.4)";
      drawRoundedRect(ctx, -s * 0.25 * corePulse, -s * 0.25 * corePulse, s * 0.5 * corePulse, s * 0.5 * corePulse, 2);
      ctx.fill();

      ctx.restore();
    }
  },

  memory: {
    category: "computing",
    color: "#06b6d4",
    glowColor: "rgba(6, 182, 212, 0.6)",
    label: "RAM",
    draw(ctx, x, y, size = 55, state = {}) {
      ctx.save();
      ctx.translate(x, y);

      const w = size * 0.85;
      const h = size * 0.35;

      // RAM PCB Stick
      ctx.fillStyle = "#083344";
      drawRoundedRect(ctx, -w * 0.5, -h * 0.5, w, h, 3);
      ctx.fill();
      ctx.strokeStyle = "#06b6d4";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Memory Chips
      for (let i = 0; i < 4; i++) {
        const cx = -w * 0.35 + i * (w * 0.22);
        ctx.fillStyle = "#155e75";
        ctx.fillRect(cx, -h * 0.35, w * 0.16, h * 0.55);
      }

      // Gold Edge Connector Pins
      ctx.fillStyle = "#facc15";
      for (let i = 0; i < 8; i++) {
        ctx.fillRect(-w * 0.42 + i * (w * 0.11), h * 0.4, 2, 4);
      }

      ctx.restore();
    }
  },

  // ==========================================
  // ACADEMIC & CONCEPTUAL
  // ==========================================
  brain: {
    category: "academic",
    color: "#ec4899",
    glowColor: "rgba(236, 72, 153, 0.6)",
    label: "Brain / Thought",
    draw(ctx, x, y, size = 55, state = {}) {
      const t = state.time || 0;
      const pulse = 1 + Math.sin(t * 3) * 0.05;

      ctx.save();
      ctx.translate(x, y);
      ctx.scale(pulse, pulse);

      // Left and Right Hemispheres
      ctx.fillStyle = "rgba(244, 114, 182, 0.3)";
      ctx.strokeStyle = "#ec4899";
      ctx.lineWidth = 2.5;

      // Left lobe
      ctx.beginPath();
      ctx.arc(-size * 0.15, -size * 0.1, size * 0.25, Math.PI * 0.5, Math.PI * 1.5);
      ctx.arc(-size * 0.1, size * 0.15, size * 0.2, Math.PI * 0.8, Math.PI * 1.8);
      ctx.stroke();

      // Right lobe
      ctx.beginPath();
      ctx.arc(size * 0.15, -size * 0.1, size * 0.25, -Math.PI * 0.5, Math.PI * 0.5);
      ctx.arc(size * 0.1, size * 0.15, size * 0.2, -Math.PI * 0.8, Math.PI * 0.2);
      ctx.stroke();

      // Neural firing Sparks
      const sparkX = Math.sin(t * 5) * size * 0.2;
      const sparkY = Math.cos(t * 4) * size * 0.15;
      ctx.beginPath();
      ctx.arc(sparkX, sparkY, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#fde047";
      ctx.fill();

      ctx.restore();
    }
  },

  person: {
    category: "academic",
    color: "#a855f7",
    glowColor: "rgba(168, 85, 247, 0.5)",
    label: "Learner",
    draw(ctx, x, y, size = 55, state = {}) {
      const t = state.time || 0;
      ctx.save();
      ctx.translate(x, y);

      // Head
      ctx.beginPath();
      ctx.arc(0, -size * 0.25, size * 0.18, 0, Math.PI * 2);
      ctx.fillStyle = "#c084fc";
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Torso / Shoulders
      ctx.beginPath();
      ctx.arc(0, size * 0.3, size * 0.35, Math.PI, 0);
      ctx.fillStyle = "#7e22ce";
      ctx.fill();
      ctx.strokeStyle = "#a855f7";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.restore();
    }
  },

  book: {
    category: "academic",
    color: "#f59e0b",
    glowColor: "rgba(245, 158, 11, 0.5)",
    label: "Knowledge",
    draw(ctx, x, y, size = 55, state = {}) {
      ctx.save();
      ctx.translate(x, y);

      const w = size * 0.75;
      const h = size * 0.5;

      // Open Book Pages
      ctx.fillStyle = "#fef3c7";
      ctx.strokeStyle = "#b45309";
      ctx.lineWidth = 2;

      // Left page
      ctx.beginPath();
      ctx.moveTo(0, h * 0.3);
      ctx.quadraticCurveTo(-w * 0.25, h * 0.2, -w * 0.5, h * 0.25);
      ctx.lineTo(-w * 0.5, -h * 0.35);
      ctx.quadraticCurveTo(-w * 0.25, -h * 0.4, 0, -h * 0.3);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Right page
      ctx.beginPath();
      ctx.moveTo(0, h * 0.3);
      ctx.quadraticCurveTo(w * 0.25, h * 0.2, w * 0.5, h * 0.25);
      ctx.lineTo(w * 0.5, -h * 0.35);
      ctx.quadraticCurveTo(w * 0.25, -h * 0.4, 0, -h * 0.3);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.restore();
    }
  },

  graph: {
    category: "academic",
    color: "#10b981",
    glowColor: "rgba(16, 185, 129, 0.6)",
    label: "Graph",
    draw(ctx, x, y, size = 55, state = {}) {
      const t = state.time || 0;
      ctx.save();
      ctx.translate(x, y);

      const s = size * 0.65;

      // Axes
      ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-s * 0.5, -s * 0.5);
      ctx.lineTo(-s * 0.5, s * 0.5);
      ctx.lineTo(s * 0.5, s * 0.5);
      ctx.stroke();

      // Animated Curve (Sine / Loss curve)
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let px = -s * 0.45; px <= s * 0.45; px += 2) {
        const normX = (px + s * 0.45) / (s * 0.9);
        const py = s * 0.4 - Math.sin(normX * Math.PI + t * 2) * s * 0.6;
        if (px === -s * 0.45) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      ctx.restore();
    }
  },

  equation: {
    category: "academic",
    color: "#ec4899",
    glowColor: "rgba(236, 72, 153, 0.6)",
    label: "Formula",
    draw(ctx, x, y, size = 55, state = {}) {
      ctx.save();
      ctx.translate(x, y);

      const w = size * 0.8;
      const h = size * 0.5;

      ctx.fillStyle = "#1e1b4b";
      drawRoundedRect(ctx, -w * 0.5, -h * 0.5, w, h, 6);
      ctx.fill();
      ctx.strokeStyle = "#818cf8";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Formula Symbol Text: f(x) = y
      ctx.fillStyle = "#c7d2fe";
      ctx.font = "bold 14px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("f(x) = y", 0, 0);

      ctx.restore();
    }
  },

  arrow: {
    category: "academic",
    color: "#f59e0b",
    glowColor: "rgba(245, 158, 11, 0.6)",
    label: "Flow",
    draw(ctx, x, y, size = 45, state = {}) {
      const t = state.time || 0;
      const pulse = 1 + Math.sin(t * 4) * 0.08;

      ctx.save();
      ctx.translate(x, y);
      ctx.scale(pulse, pulse);

      ctx.fillStyle = "#f59e0b";
      ctx.beginPath();
      ctx.moveTo(-size * 0.35, -size * 0.1);
      ctx.lineTo(size * 0.05, -size * 0.1);
      ctx.lineTo(size * 0.05, -size * 0.25);
      ctx.lineTo(size * 0.4, 0);
      ctx.lineTo(size * 0.05, size * 0.25);
      ctx.lineTo(size * 0.05, size * 0.1);
      ctx.lineTo(-size * 0.35, size * 0.1);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }
  },

  "process box": {
    category: "academic",
    color: "#6366f1",
    glowColor: "rgba(99, 102, 241, 0.6)",
    label: "Process",
    draw(ctx, x, y, size = 55, state = {}) {
      const t = state.time || 0;
      ctx.save();
      ctx.translate(x, y);

      const w = size * 0.85;
      const h = size * 0.55;

      // Capsule / Process Container
      ctx.fillStyle = "#1e1b4b";
      drawRoundedRect(ctx, -w * 0.5, -h * 0.5, w, h, 8);
      ctx.fill();

      // Pulsing border
      const glowAlpha = 0.5 + Math.sin(t * 3) * 0.3;
      ctx.strokeStyle = `rgba(129, 140, 248, ${glowAlpha})`;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Cog / Processing gears inside
      ctx.save();
      ctx.rotate(t * 2);
      ctx.strokeStyle = "#a5b4fc";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 7, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      ctx.restore();
    }
  }
};

// Aliases for synonyms
VISUAL_OBJECTS["student"] = VISUAL_OBJECTS["person"];
VISUAL_OBJECTS["teacher"] = VISUAL_OBJECTS["person"];
VISUAL_OBJECTS["laptop"] = VISUAL_OBJECTS["computer"];
VISUAL_OBJECTS["network node"] = VISUAL_OBJECTS["router"];
VISUAL_OBJECTS["node"] = VISUAL_OBJECTS["router"];
VISUAL_OBJECTS["document"] = VISUAL_OBJECTS["book"];
VISUAL_OBJECTS["disk"] = VISUAL_OBJECTS["database"];
VISUAL_OBJECTS["electron"] = VISUAL_OBJECTS["atom"];
VISUAL_OBJECTS["particle"] = VISUAL_OBJECTS["atom"];
VISUAL_OBJECTS["rain"] = VISUAL_OBJECTS["water"];
VISUAL_OBJECTS["number"] = VISUAL_OBJECTS["equation"];
VISUAL_OBJECTS["light"] = VISUAL_OBJECTS["sun"];
VISUAL_OBJECTS["container"] = VISUAL_OBJECTS["process box"];

/**
 * Universal Fallback Renderer for any unseen object name.
 * Renders an intentional, beautifully stylized 2D entity badge with glowing energy core,
 * procedural orbital rings, and dynamic title.
 */
export function drawGenericObject(ctx, x, y, size = 55, objectName = "Concept", state = {}) {
  const t = state.time || 0;
  const pulse = 1 + Math.sin(t * 3) * 0.05;
  const r = size * 0.36 * pulse;

  ctx.save();
  ctx.translate(x, y);

  // Outer orbital energy halo
  ctx.beginPath();
  ctx.arc(0, 0, r * 1.5, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(139, 92, 246, 0.25)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Floating orbiting electron bit
  const orbAngle = t * 2.5;
  ctx.beginPath();
  ctx.arc(Math.cos(orbAngle) * r * 1.5, Math.sin(orbAngle) * r * 1.5, 3, 0, Math.PI * 2);
  ctx.fillStyle = "#38bdf8";
  ctx.fill();

  // Core Entity Badge
  const grad = ctx.createRadialGradient(0, 0, 2, 0, 0, r);
  grad.addColorStop(0, "#4338ca");
  grad.addColorStop(0.7, "#1e1b4b");
  grad.addColorStop(1, "#0f172a");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(167, 139, 250, 0.8)";
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Center Glyph (first letter of concept in bold stylized font)
  const initial = (objectName || "C").charAt(0).toUpperCase();
  ctx.fillStyle = "#ffffff";
  ctx.font = `bold ${Math.round(size * 0.32)}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(initial, 0, 1);

  ctx.restore();
}

/**
 * Dispatches drawing to the object's custom renderer or the universal generic renderer.
 */
export function renderVisualObject(ctx, objectName, x, y, size = 60, state = {}) {
  const cleanName = (objectName || "").toLowerCase().trim();
  const objDef = VISUAL_OBJECTS[cleanName];

  if (objDef && typeof objDef.draw === "function") {
    objDef.draw(ctx, x, y, size, state);
  } else {
    drawGenericObject(ctx, x, y, size, objectName, state);
  }

  // Draw clean text label badge underneath the object
  ctx.save();
  ctx.font = "bold 11px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  const labelText = (objDef?.label || objectName || "Concept")
    .split("_")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const textMetrics = ctx.measureText(labelText);
  const pillW = textMetrics.width + 14;
  const pillH = 18;
  const pillY = y + size * 0.42;

  ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
  drawRoundedRect(ctx, x - pillW * 0.5, pillY, pillW, pillH, 5);
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = "#f8fafc";
  ctx.fillText(labelText, x, pillY + 3);

  ctx.restore();
}
