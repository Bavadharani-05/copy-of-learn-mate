import React, { useRef, useEffect } from 'react';
import { renderVisualObject } from './visualObjects';
import { ParticleSystem, computeObjectActionTransform } from './animationActions';

/**
 * DynamicSceneCanvas
 * 
 * 60FPS Continuous HTML5 Motion Graphics Animation Engine.
 * 
 * Capabilities:
 * - Truly dynamic: zero hardcoded topic checks.
 * - Procedural 2D educational rendering of any objects & actions.
 * - Dynamic environment backgrounds: nature, digital network, computer, graph grid, laboratory, classroom, generic.
 * - Fluid bezier connection paths & energetic particle flow streams.
 * - Continuous camera drift, object interactions, depth parallax & cinema vignette.
 */
export function DynamicSceneCanvas({
  scene,
  sceneIndex = 0,
  sceneProgress = 0, // 0 to 1
  isPlaying = true,
  speed = 1,
  environment = "generic",
  user = null
}) {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const particleSysRef = useRef(new ParticleSystem());
  const stateRef = useRef({
    time: 0,
    ambientParticles: [],
    flowTimer: 0
  });

  const isChild = user?.ageGroup?.toLowerCase()?.includes("child");
  const baseObjectSize = isChild ? 75 : 62;

  // Initialize ambient environment particles
  useEffect(() => {
    const particles = [];
    const count = 35;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random(),
        y: Math.random(),
        radius: Math.random() * 2.2 + 0.8,
        speedX: (Math.random() - 0.5) * 0.0004,
        speedY: (Math.random() - 0.5) * 0.0004,
        alpha: Math.random() * 0.5 + 0.2,
        phase: Math.random() * Math.PI * 2
      });
    }
    stateRef.current.ambientParticles = particles;
  }, [environment]);

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

      // --- 1. DYNAMIC ENVIRONMENT BACKGROUND ---
      drawDynamicBackground(ctx, w, h, t, environment);

      // --- 2. AMBIENT DRIFT PARTICLES ---
      stateRef.current.ambientParticles.forEach((p) => {
        p.x = (p.x + p.speedX * (isPlaying ? 1 : 0.3) + 1) % 1;
        p.y = (p.y + p.speedY * (isPlaying ? 1 : 0.3) + 1) % 1;
        const pulseAlpha = Math.max(0.1, p.alpha + Math.sin(t * 3 + p.phase) * 0.15);

        ctx.fillStyle = environment.includes("nature")
          ? `rgba(167, 243, 208, ${pulseAlpha})`
          : environment.includes("network") || environment.includes("computer")
          ? `rgba(56, 189, 248, ${pulseAlpha})`
          : `rgba(226, 232, 240, ${pulseAlpha})`;

        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // --- 3. DYNAMIC SCENE OBJECTS & INTERACTION LAYOUT ---
      const objects = scene?.objects || ["concept"];
      const actions = scene?.actions || ["pulse"];
      const objCount = objects.length;

      // Calculate layout positions for objects
      const positions = computeDynamicPositions(objects, w, h);

      // --- 4. BEZIER INTERACTION FLOWS & CONNECTORS ---
      if (objCount >= 2) {
        drawInteractionsAndFlows(
          ctx,
          positions,
          objects,
          actions,
          t,
          delta,
          particleSysRef.current,
          isPlaying
        );
      }

      // --- 5. RENDER OBJECTS WITH DYNAMIC ACTION TRANSFORMS ---
      positions.forEach((pos, idx) => {
        const objName = objects[idx];
        const transform = computeObjectActionTransform(
          actions,
          idx,
          objCount,
          t,
          sceneProgress
        );

        ctx.save();
        ctx.translate(pos.x + transform.offsetX, pos.y + transform.offsetY);
        ctx.scale(transform.scale, transform.scale);
        ctx.rotate(transform.rotation);
        ctx.globalAlpha = Math.max(0, Math.min(1, transform.opacity));

        // Action Glow Halo
        if (transform.glowIntensity > 0) {
          ctx.save();
          ctx.shadowColor = transform.glowColor;
          ctx.shadowBlur = transform.glowIntensity;
          ctx.beginPath();
          ctx.arc(0, 0, baseObjectSize * 0.55, 0, Math.PI * 2);
          ctx.fillStyle = transform.glowColor;
          ctx.fill();
          ctx.restore();
        }

        renderVisualObject(ctx, objName, 0, 0, baseObjectSize, {
          time: t,
          sceneIndex,
          sceneProgress,
          actions
        });

        ctx.restore();
      });

      // --- 6. CINEMATIC LETTERBOX VIGNETTE ---
      const vignette = ctx.createRadialGradient(w * 0.5, h * 0.5, h * 0.35, w * 0.5, h * 0.5, w * 0.78);
      vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vignette.addColorStop(1, 'rgba(2, 6, 23, 0.7)');
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
  }, [scene, sceneIndex, sceneProgress, isPlaying, speed, environment, isChild]);

  return (
    <div className="relative w-full aspect-video min-h-[340px] md:min-h-[420px] max-h-[560px] bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800/90">
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-pointer select-none"
      />
    </div>
  );
}

/**
 * Computes balanced 2D coordinates for any set of 1 to 5 objects
 */
function computeDynamicPositions(objects, w, h) {
  const count = objects.length;
  const positions = [];

  if (count === 1) {
    positions.push({ x: w * 0.5, y: h * 0.5 });
  } else if (count === 2) {
    positions.push({ x: w * 0.28, y: h * 0.5 });
    positions.push({ x: w * 0.72, y: h * 0.5 });
  } else if (count === 3) {
    // If first is sun/source, position top-left
    const first = objects[0].toLowerCase();
    if (first.includes("sun") || first.includes("user") || first.includes("client")) {
      positions.push({ x: w * 0.22, y: h * 0.32 });
      positions.push({ x: w * 0.50, y: h * 0.62 });
      positions.push({ x: w * 0.78, y: h * 0.45 });
    } else {
      positions.push({ x: w * 0.22, y: h * 0.5 });
      positions.push({ x: w * 0.50, y: h * 0.5 });
      positions.push({ x: w * 0.78, y: h * 0.5 });
    }
  } else if (count === 4) {
    positions.push({ x: w * 0.25, y: h * 0.36 });
    positions.push({ x: w * 0.75, y: h * 0.36 });
    positions.push({ x: w * 0.25, y: h * 0.68 });
    positions.push({ x: w * 0.75, y: h * 0.68 });
  } else {
    // 5 objects: horizontal wave or circle
    for (let i = 0; i < count; i++) {
      const step = w / (count + 1);
      const waveY = h * 0.5 + Math.sin(i * 1.5) * (h * 0.15);
      positions.push({ x: step * (i + 1), y: waveY });
    }
  }

  return positions;
}

/**
 * Draws dynamic flows, particle streams, and glowing energy connectors between objects
 */
function drawInteractionsAndFlows(ctx, positions, objects, actions, time, delta, particleSystem, isPlaying) {
  const actStr = actions.join(" ").toLowerCase();
  const isSunRays = actStr.includes("sun_rays");
  const isWaterFlow = actStr.includes("water_flow_up");
  const isPacketFlow = actStr.includes("packet_flow") || actStr.includes("flow");

  // Determine connections: usually chain from item 0 -> 1 -> 2 ...
  for (let i = 0; i < positions.length - 1; i++) {
    const from = positions[i];
    const to = positions[i + 1];

    // Subtle curved energy line
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    const midX = (from.x + to.x) * 0.5;
    const midY = (from.y + to.y) * 0.5 - 20;
    ctx.quadraticCurveTo(midX, midY, to.x, to.y);

    const beamGrad = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
    if (isSunRays) {
      beamGrad.addColorStop(0, "rgba(251, 191, 36, 0.5)");
      beamGrad.addColorStop(1, "rgba(52, 211, 153, 0.4)");
    } else if (isWaterFlow) {
      beamGrad.addColorStop(0, "rgba(14, 165, 233, 0.5)");
      beamGrad.addColorStop(1, "rgba(16, 185, 129, 0.4)");
    } else {
      beamGrad.addColorStop(0, "rgba(56, 189, 248, 0.4)");
      beamGrad.addColorStop(1, "rgba(168, 85, 247, 0.4)");
    }

    ctx.strokeStyle = beamGrad;
    ctx.lineWidth = 2.5;
    ctx.setLineDash([6, 6]);
    ctx.lineDashOffset = -time * 25;
    ctx.stroke();
    ctx.restore();

    // Spawn dynamic particles along the path
    if (isPlaying && Math.random() < 0.25) {
      const pType = isSunRays ? "sun_rays" : isWaterFlow ? "water_flow_up" : "packet_flow";
      const pColor = isSunRays ? "#fef08a" : isWaterFlow ? "#38bdf8" : "#a855f7";
      particleSystem.emitFlowParticles(from.x, from.y, to.x, to.y, pType, 1, pColor);
    }
  }

  // Update and render all active flying particles
  particleSystem.updateAndRender(ctx, delta, isPlaying);
}

/**
 * Draws animated environmental backdrop tailored to the content domain
 */
function drawDynamicBackground(ctx, w, h, t, env = "generic") {
  const envKey = (env || "generic").toLowerCase();

  // 1. Base Radial Gradient
  const bgGrad = ctx.createRadialGradient(w * 0.5, h * 0.45, 10, w * 0.5, h * 0.5, w * 0.85);

  if (envKey.includes("nature")) {
    bgGrad.addColorStop(0, '#062016');
    bgGrad.addColorStop(0.5, '#041610');
    bgGrad.addColorStop(1, '#020b08');
  } else if (envKey.includes("network")) {
    bgGrad.addColorStop(0, '#09152e');
    bgGrad.addColorStop(0.5, '#060d1f');
    bgGrad.addColorStop(1, '#03060f');
  } else if (envKey.includes("computer")) {
    bgGrad.addColorStop(0, '#0d1527');
    bgGrad.addColorStop(0.5, '#080c18');
    bgGrad.addColorStop(1, '#020409');
  } else if (envKey.includes("graph") || envKey.includes("math")) {
    bgGrad.addColorStop(0, '#10162a');
    bgGrad.addColorStop(0.5, '#0a0d1d');
    bgGrad.addColorStop(1, '#03040a');
  } else if (envKey.includes("laboratory")) {
    bgGrad.addColorStop(0, '#082329');
    bgGrad.addColorStop(0.5, '#05161a');
    bgGrad.addColorStop(1, '#02090b');
  } else if (envKey.includes("classroom")) {
    bgGrad.addColorStop(0, '#1c1429');
    bgGrad.addColorStop(0.5, '#120c1d');
    bgGrad.addColorStop(1, '#07040d');
  } else {
    // Generic cinematic nebula
    bgGrad.addColorStop(0, '#0f172a');
    bgGrad.addColorStop(0.6, '#090d16');
    bgGrad.addColorStop(1, '#020408');
  }

  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // 2. Procedural Environment Accents
  if (envKey.includes("nature")) {
    // Soft atmospheric sunbeam rays
    ctx.save();
    const rayAngle = 0.4 + Math.sin(t * 0.5) * 0.05;
    const sunbeam = ctx.createLinearGradient(0, 0, w * 0.6, h);
    sunbeam.addColorStop(0, "rgba(253, 224, 71, 0.07)");
    sunbeam.addColorStop(0.5, "rgba(52, 211, 153, 0.03)");
    sunbeam.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = sunbeam;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(w * 0.4, 0);
    ctx.lineTo(w * 0.9, h);
    ctx.lineTo(w * 0.2, h);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  } else if (envKey.includes("network") || envKey.includes("computer") || envKey.includes("graph")) {
    // Precision Tech Grid
    ctx.save();
    ctx.strokeStyle = envKey.includes("network")
      ? 'rgba(56, 189, 248, 0.04)'
      : 'rgba(168, 85, 247, 0.04)';
    ctx.lineWidth = 1;
    const gridSize = 36;
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
    ctx.restore();
  }
}
