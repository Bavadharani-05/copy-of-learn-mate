/**
 * animationActions.js
 * 
 * Reusable Animation Actions & Particle System for LearnMate.
 * 
 * Interprets Qwen action tags (e.g. sun_rays, water_flow_up, packet_flow,
 * plant_sway, leaf_glow, appear, pulse, connect, split, merge, etc.)
 * and renders continuous physics-based animations, particle streams, and motion transforms.
 */

export class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  reset() {
    this.particles = [];
  }

  /**
   * Spawns flow particles between two 2D points (e.g., from Sun to Plant, or PC to Router)
   */
  emitFlowParticles(fromX, fromY, toX, toY, type = "flow", count = 2, color = "#38bdf8") {
    if (this.particles.length > 120) return; // limit pool

    for (let i = 0; i < count; i++) {
      this.particles.push({
        fromX,
        fromY,
        toX,
        toY,
        progress: Math.random() * 0.1,
        speed: 0.008 + Math.random() * 0.012,
        size: type === "sun_rays" ? 3.5 : type === "water_flow_up" ? 3.0 : 2.5,
        color: color,
        type: type,
        seed: Math.random() * Math.PI * 2,
        life: 1.0
      });
    }
  }

  /**
   * Updates and draws all active particles in the scene
   */
  updateAndRender(ctx, delta, isPlaying = true) {
    const alive = [];

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      if (isPlaying) {
        p.progress += p.speed * (delta * 60);
      }

      if (p.progress < 1.0) {
        alive.push(p);

        // Linear interpolation with perpendicular arc curve
        const t = p.progress;
        const baseCurvature = Math.sin(t * Math.PI);
        const arc = (p.type === "water_flow_up" ? -15 : 20) * baseCurvature * Math.sin(p.seed);

        const currX = p.fromX + (p.toX - p.fromX) * t + (p.type === "water_flow_up" ? Math.sin(t * 10 + p.seed) * 4 : 0);
        const currY = p.fromY + (p.toY - p.fromY) * t + (p.type === "water_flow_up" ? -t * 10 : arc);

        ctx.save();
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(currX, currY, p.size * (0.6 + baseCurvature * 0.5), 0, Math.PI * 2);
        ctx.fill();

        // Particle trail
        if (p.type === "sun_rays" || p.type === "packet_flow") {
          const prevT = Math.max(0, t - 0.06);
          const prevX = p.fromX + (p.toX - p.fromX) * prevT;
          const prevY = p.fromY + (p.toY - p.fromY) * prevT;
          ctx.strokeStyle = p.color;
          ctx.lineWidth = p.size * 0.8;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(currX, currY);
          ctx.stroke();
        }

        ctx.restore();
      }
    }

    this.particles = alive;
  }
}

/**
 * Calculates dynamic transforms and styling for an object based on the scene's active actions.
 */
export function computeObjectActionTransform(actions = [], objIndex = 0, objCount = 1, time = 0, sceneProgress = 0) {
  let scale = 1.0;
  let rotation = 0;
  let offsetX = 0;
  let offsetY = 0;
  let opacity = 1.0;
  let glowIntensity = 0;
  let glowColor = "rgba(139, 92, 246, 0.5)";

  const actStr = actions.join(" ").toLowerCase();

  // 1. Entrance / Exit
  if (actStr.includes("appear") || actStr.includes("fade_in")) {
    const entranceT = Math.min(1, sceneProgress * 3.5);
    // Smooth back-out overshoot curve
    const c1 = 1.70158;
    const c3 = c1 + 1;
    const overshoot = 1 + c3 * Math.pow(entranceT - 1, 3) + c1 * Math.pow(entranceT - 1, 2);
    scale = Math.max(0.1, entranceT >= 1 ? 1 : overshoot);
    opacity = Math.min(1, entranceT);
  }

  if (actStr.includes("disappear") || actStr.includes("fade_out")) {
    if (sceneProgress > 0.7) {
      const exitT = (sceneProgress - 0.7) / 0.3;
      scale = Math.max(0, 1 - exitT);
      opacity = Math.max(0, 1 - exitT);
    }
  }

  // 2. Harmonic Sway (plants, leaves, trees)
  if (actStr.includes("sway") || actStr.includes("plant_sway")) {
    rotation += Math.sin(time * 2.5 + objIndex) * 0.1;
  }

  // 3. Pulse (energetic beat)
  if (actStr.includes("pulse") || actStr.includes("beat")) {
    scale *= (1 + Math.sin(time * 5 + objIndex * 1.5) * 0.08);
  }

  // 4. Bounce (physics hop)
  if (actStr.includes("bounce") || actStr.includes("jump")) {
    offsetY += -Math.abs(Math.sin(time * 4 + objIndex)) * 14;
  }

  // 5. Shake (jitter / high activity)
  if (actStr.includes("shake") || actStr.includes("vibrate")) {
    offsetX += (Math.sin(time * 25) * 3);
    offsetY += (Math.cos(time * 23) * 2);
  }

  // 6. Glow / Highlight
  if (actStr.includes("glow") || actStr.includes("leaf_glow") || actStr.includes("highlight")) {
    glowIntensity = 15 + Math.sin(time * 4) * 8;
    glowColor = actStr.includes("leaf") ? "rgba(52, 211, 153, 0.8)" : "rgba(251, 191, 36, 0.8)";
  }

  // 7. Grow / Shrink
  if (actStr.includes("grow") || actStr.includes("expand")) {
    scale *= Math.min(1.25, 0.9 + sceneProgress * 0.35);
  }
  if (actStr.includes("shrink") || actStr.includes("contract")) {
    scale *= Math.max(0.75, 1.1 - sceneProgress * 0.35);
  }

  // 8. Rotate / Orbit
  if (actStr.includes("rotate") || actStr.includes("spin")) {
    rotation += time * 1.8;
  }

  // 9. Split / Disperse (push outward from center)
  if (actStr.includes("split") || actStr.includes("divide")) {
    const dir = objIndex % 2 === 0 ? -1 : 1;
    offsetX += dir * Math.sin(sceneProgress * Math.PI) * 25;
  }

  // 10. Merge / Combine (pull toward center)
  if (actStr.includes("merge") || actStr.includes("join")) {
    const dir = objIndex % 2 === 0 ? 1 : -1;
    offsetX += dir * (1 - sceneProgress) * 20;
  }

  return {
    scale,
    rotation,
    offsetX,
    offsetY,
    opacity,
    glowIntensity,
    glowColor
  };
}
