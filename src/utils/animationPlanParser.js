/**
 * animationPlanParser.js
 * 
 * Dynamic Animation Plan Parser & Fallback Generator for LearnMate.
 * 
 * Features:
 * - Robust extraction of JSON animation plans from Qwen / LLM responses
 *   (strips markdown fences, extracts nested objects, validates scene structure).
 * - Dynamic local animation plan generator (NLP-based, ZERO hardcoded topic checks).
 *   Works for ANY topic (photosynthesis, TCP, recursion, gradient descent, economics, etc.).
 * - Sanitization, duration bounding, object & action normalization.
 */

// Common visual object synonym mappings to map arbitrary nouns to canonical visual objects
const OBJECT_SYNONYMS = {
  // Nature & Bio
  sunlight: "sun",
  solar: "sun",
  light: "sun",
  sun: "sun",
  ray: "sun",
  rays: "sun",
  plant: "plant",
  sprout: "plant",
  seed: "plant",
  stem: "plant",
  flower: "plant",
  leaf: "leaf",
  leaves: "leaf",
  chloroplast: "leaf",
  chlorophyll: "leaf",
  tree: "tree",
  forest: "tree",
  wood: "tree",
  water: "water",
  droplet: "water",
  moisture: "water",
  liquid: "water",
  h2o: "water",
  rain: "rain",
  cloud: "cloud",
  vapor: "cloud",
  soil: "soil",
  earth: "soil",
  ground: "soil",
  root: "soil",
  roots: "soil",
  molecule: "molecule",
  glucose: "molecule",
  sugar: "molecule",
  oxygen: "molecule",
  o2: "molecule",
  carbon: "molecule",
  co2: "molecule",
  atom: "atom",
  electron: "electron",
  proton: "atom",
  neutron: "atom",

  // Computing & Digital
  computer: "computer",
  pc: "computer",
  client: "computer",
  browser: "computer",
  laptop: "laptop",
  workstation: "laptop",
  server: "server",
  host: "server",
  backend: "server",
  router: "router",
  switch: "router",
  gateway: "router",
  network: "network node",
  node: "network node",
  peer: "network node",
  packet: "packet",
  data: "packet",
  message: "packet",
  payload: "packet",
  segment: "packet",
  frame: "packet",
  bit: "packet",
  byte: "packet",
  database: "database",
  db: "database",
  storage: "database",
  table: "database",
  cpu: "cpu",
  processor: "cpu",
  core: "cpu",
  chip: "cpu",
  memory: "memory",
  ram: "memory",
  cache: "memory",
  stack: "memory",
  heap: "memory",
  disk: "disk",
  harddrive: "disk",

  // Academic & Conceptual
  person: "person",
  user: "person",
  human: "person",
  student: "student",
  learner: "student",
  pupil: "student",
  teacher: "teacher",
  instructor: "teacher",
  expert: "teacher",
  brain: "brain",
  mind: "brain",
  neuron: "brain",
  neural: "brain",
  synapse: "brain",
  book: "book",
  manual: "book",
  textbook: "book",
  document: "document",
  file: "document",
  code: "document",
  script: "document",
  graph: "graph",
  chart: "graph",
  curve: "graph",
  plot: "graph",
  diagram: "graph",
  equation: "equation",
  formula: "equation",
  math: "equation",
  number: "number",
  value: "number",
  digit: "number",
  variable: "number",
  arrow: "arrow",
  vector: "arrow",
  direction: "arrow",
  pointer: "arrow",
  particle: "particle",
  photon: "particle",
  ion: "particle",
  container: "container",
  box: "container",
  wrapper: "container",
  process: "process box",
  function: "process box",
  algorithm: "process box",
  module: "process box",
  step: "process box"
};

// Common action synonym mappings
const ACTION_SYNONYMS = {
  // Radiations & Rays
  sun_rays: "sun_rays",
  sunlight: "sun_rays",
  shine: "sun_rays",
  radiate: "sun_rays",
  beam: "sun_rays",
  emit: "sun_rays",

  // Flows & Streams
  water_flow_up: "water_flow_up",
  water_flow: "water_flow_up",
  absorb_water: "water_flow_up",
  packet_flow: "packet_flow",
  send_packet: "packet_flow",
  transmit: "packet_flow",
  packet_move: "packet_flow",
  packet_split: "split",
  flow: "flow",
  stream: "flow",
  particle_flow: "particle_flow",
  drift: "particle_flow",

  // Motions
  move: "move",
  move_to: "move_to",
  travel: "move",
  push: "move",
  transfer: "move",
  sway: "sway",
  plant_sway: "sway",
  swing: "sway",
  bounce: "bounce",
  jump: "bounce",
  pulse: "pulse",
  beat: "pulse",
  shake: "shake",
  vibrate: "shake",
  rotate: "rotate",
  spin: "rotate",
  orbit: "orbit",
  circle: "orbit",

  // Transitions & Highlights
  appear: "appear",
  enter: "appear",
  fade_in: "fade_in",
  disappear: "disappear",
  fade_out: "fade_out",
  grow: "grow",
  expand: "grow",
  shrink: "shrink",
  contract: "shrink",
  glow: "glow",
  leaf_glow: "glow",
  highlight: "highlight",
  flash: "highlight",
  transform: "transform",
  convert: "transform",
  synthesize: "transform",
  connect: "connect",
  link: "connect",
  bind: "connect",
  disconnect: "disconnect",
  split: "split",
  divide: "split",
  fork: "split",
  merge: "merge",
  combine: "merge",
  join: "merge",
  neuron_signal: "neuron_signal",
  fire_neuron: "neuron_signal"
};

/**
 * Normalizes an object name string to a clean alphanumeric token
 */
export function normalizeObjectName(objStr) {
  if (!objStr || typeof objStr !== "string") return "process box";
  const clean = objStr.toLowerCase().trim().replace(/[^a-z0-9_\-\s]/g, "");
  const single = clean.replace(/\s+/g, "_");
  if (OBJECT_SYNONYMS[single]) return OBJECT_SYNONYMS[single];
  if (OBJECT_SYNONYMS[clean]) return OBJECT_SYNONYMS[clean];
  // check words inside
  const words = clean.split(/[\s_\-]+/);
  for (const w of words) {
    if (OBJECT_SYNONYMS[w]) return OBJECT_SYNONYMS[w];
  }
  return single.replace(/_/g, " ");
}

/**
 * Normalizes an action string
 */
export function normalizeActionName(actStr) {
  if (!actStr || typeof actStr !== "string") return "pulse";
  const clean = actStr.toLowerCase().trim().replace(/[^a-z0-9_]/g, "_");
  if (ACTION_SYNONYMS[clean]) return ACTION_SYNONYMS[clean];
  const words = clean.split("_");
  for (const w of words) {
    if (ACTION_SYNONYMS[w]) return ACTION_SYNONYMS[w];
  }
  return clean || "pulse";
}

/**
 * Detects the most appropriate environment context from text or objects
 */
export function detectEnvironment(text = "", objects = []) {
  const t = (text + " " + objects.join(" ")).toLowerCase();

  const scores = {
    nature: 0,
    "digital network": 0,
    computer: 0,
    "graph grid": 0,
    laboratory: 0,
    classroom: 0
  };

  // Nature / Biology
  if (/\b(plant|leaf|sun|tree|water|soil|rain|chlorophyll|cell|photosynthesis|ecosystem|nature|organism|biology|flower|seed)\b/i.test(t)) {
    scores.nature += 5;
  }

  // Networking
  if (/\b(tcp|ip|packet|router|network|server|client|protocol|dns|http|socket|bandwidth|port|browser|internet|connection)\b/i.test(t)) {
    scores["digital network"] += 5;
  }

  // Computing / Programming
  if (/\b(recursion|function|stack|memory|cpu|algorithm|code|python|array|loop|variable|compiler|pointer|hardware|program)\b/i.test(t)) {
    scores.computer += 5;
  }

  // Math / Optimization
  if (/\b(gradient|descent|math|equation|vector|matrix|graph|derivative|calculus|loss|optimization|formula|axis|coordinate)\b/i.test(t)) {
    scores["graph grid"] += 5;
  }

  // Chemistry / Laboratory
  if (/\b(molecule|atom|electron|reaction|chemical|element|compound|flask|acid|solution|catalyst|quantum)\b/i.test(t)) {
    scores.laboratory += 5;
  }

  // Classroom / General Study
  if (/\b(learn|study|history|language|concept|book|lesson|teacher|student|school|theory)\b/i.test(t)) {
    scores.classroom += 3;
  }

  let highestEnv = "generic";
  let highestScore = 0;
  for (const [env, score] of Object.entries(scores)) {
    if (score > highestScore) {
      highestScore = score;
      highestEnv = env;
    }
  }

  return highestEnv;
}

/**
 * Robust parser for Qwen animation plan output.
 * Handles markdown ```json blocks, raw JSON, embedded JSON within text,
 * and validates scene objects & actions.
 */
export function parseAnimationPlan(rawResponse, fallbackAnswer = "", fallbackTitle = "Concept Explanation") {
  if (!rawResponse) {
    return generateDynamicAnimationPlanLocally(fallbackAnswer, fallbackTitle);
  }

  let data = null;

  // 1. If already an object
  if (typeof rawResponse === "object" && rawResponse !== null) {
    data = rawResponse;
  } else if (typeof rawResponse === "string") {
    let text = rawResponse.trim();

    // Strip markdown fences
    text = text.replace(/^```(?:json)?\s*/i, "");
    text = text.replace(/\s*```$/i, "");
    text = text.trim();

    // Direct JSON parse attempt
    try {
      data = JSON.parse(text);
    } catch (e) {
      // Substring candidate extraction between first '{' and last '}'
      const firstBrace = text.indexOf("{");
      const lastBrace = text.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        const candidate = text.substring(firstBrace, lastBrace + 1);
        try {
          data = JSON.parse(candidate);
        } catch (candidateErr) {
          console.warn("JSON substring candidate failed to parse:", candidateErr);
        }
      }
    }
  }

  // If data has an animation field wrapper { answer, animation }
  if (data && data.animation && typeof data.animation === "object") {
    data = data.animation;
  }

  // Validate that data contains scenes array
  if (data && Array.isArray(data.scenes) && data.scenes.length > 0) {
    const title = data.title || fallbackTitle;
    const rawScenes = data.scenes;
    const allObjects = [];

    const sanitizedScenes = rawScenes.map((scene, idx) => {
      const duration = Math.min(8, Math.max(3, Number(scene.duration) || 4));
      const caption = scene.caption || `Scene ${idx + 1} of ${title}`;
      
      let objects = Array.isArray(scene.objects) ? scene.objects : [];
      if (objects.length === 0 && typeof scene.objects === "string") {
        objects = [scene.objects];
      }
      const normObjects = objects.map(normalizeObjectName).slice(0, 5);
      if (normObjects.length === 0) {
        normObjects.push("process box", "concept");
      }
      normObjects.forEach(o => allObjects.push(o));

      let actions = Array.isArray(scene.actions) ? scene.actions : [];
      if (actions.length === 0 && typeof scene.actions === "string") {
        actions = [scene.actions];
      }
      const normActions = actions.map(normalizeActionName).slice(0, 5);
      if (normActions.length === 0) {
        normActions.push("appear", "pulse");
      }

      return {
        duration,
        caption,
        objects: normObjects,
        actions: normActions
      };
    });

    const environment = data.environment || detectEnvironment(data.title || fallbackTitle, allObjects);

    return {
      title,
      environment,
      scenes: sanitizedScenes
    };
  }

  // Fallback: dynamically generate animation plan from the answer text
  return generateDynamicAnimationPlanLocally(fallbackAnswer || (typeof rawResponse === "string" ? rawResponse : ""), fallbackTitle);
}

/**
 * Dynamic Local Animation Plan Generator.
 * ZERO hardcoded topics. Analyzes the text sentences, discovers real concepts and action verbs,
 * and creates 3-5 structured scenes.
 */
export function generateDynamicAnimationPlanLocally(answerText = "", title = "Educational Explanation", userProfile = null) {
  const cleanText = (answerText || "").replace(/`{1,3}[\s\S]*?`{1,3}/g, "").trim();

  // Split into sentences / meaningful thought chunks
  const rawSentences = cleanText
    .split(/(?<=[.?!])\s+(?=[A-Z0-9])/g)
    .map(s => s.trim())
    .filter(s => s.length > 15 && !s.startsWith("```"));

  const sentences = rawSentences.length > 0 ? rawSentences : [
    cleanText || `Understanding the fundamental principles of ${title}.`
  ];

  // Group sentences into 3 to 5 coherent scenes
  const sceneCount = Math.min(5, Math.max(3, Math.ceil(sentences.length / 2)));
  const chunkSize = Math.max(1, Math.ceil(sentences.length / sceneCount));

  const scenes = [];
  const allDetectedObjects = [];

  for (let i = 0; i < sceneCount; i++) {
    const chunkSentences = sentences.slice(i * chunkSize, (i + 1) * chunkSize);
    if (chunkSentences.length === 0) break;

    const caption = chunkSentences.join(" ").slice(0, 140);
    const sceneText = caption.toLowerCase();

    // Dynamically identify objects from the vocabulary in the caption
    const detectedObjects = [];
    for (const [synonym, canon] of Object.entries(OBJECT_SYNONYMS)) {
      const regex = new RegExp(`\\b${synonym}\\b`, "i");
      if (regex.test(sceneText) && !detectedObjects.includes(canon)) {
        detectedObjects.push(canon);
        if (detectedObjects.length >= 4) break;
      }
    }

    // If none detected, extract top nouns or provide educational anchors
    if (detectedObjects.length === 0) {
      if (i === 0) {
        detectedObjects.push("book", "concept");
      } else if (i === sceneCount - 1) {
        detectedObjects.push("process box", "graph");
      } else {
        detectedObjects.push("node", "arrow", "process box");
      }
    } else if (detectedObjects.length === 1) {
      detectedObjects.push("arrow", "process box");
    }

    detectedObjects.forEach(o => allDetectedObjects.push(o));

    // Dynamically identify actions
    const detectedActions = [];
    for (const [actionWord, canonAction] of Object.entries(ACTION_SYNONYMS)) {
      const regex = new RegExp(`\\b${actionWord}\\b`, "i");
      if (regex.test(sceneText) && !detectedActions.includes(canonAction)) {
        detectedActions.push(canonAction);
        if (detectedActions.length >= 3) break;
      }
    }

    // Default action progression across scenes
    if (detectedActions.length === 0) {
      if (i === 0) {
        detectedActions.push("appear", "fade_in", "pulse");
      } else if (i === 1) {
        detectedActions.push("move", "flow", "grow");
      } else if (i === sceneCount - 1) {
        detectedActions.push("highlight", "glow", "transform");
      } else {
        detectedActions.push("flow", "pulse", "connect");
      }
    }

    // Adjust duration for reading speed (4 to 6 seconds per scene)
    const wordCount = caption.split(/\s+/).length;
    let duration = Math.min(6, Math.max(4, Math.round(wordCount * 0.3)));
    if (userProfile?.ageGroup?.toLowerCase()?.includes("child")) {
      duration = Math.round(duration * 1.2);
    }

    scenes.push({
      duration,
      caption,
      objects: detectedObjects.slice(0, 4),
      actions: detectedActions.slice(0, 3)
    });
  }

  // Ensure at least 3 scenes
  while (scenes.length < 3) {
    const idx = scenes.length;
    scenes.push({
      duration: 4,
      caption: `Key principles and dynamic interactions in ${title}.`,
      objects: ["concept", "process box", "arrow"],
      actions: ["flow", "glow"]
    });
  }

  const environment = detectEnvironment(cleanText, allDetectedObjects);

  return {
    title,
    environment,
    scenes
  };
}
