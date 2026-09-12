/**
 * animatedExplanationEngine.js
 * 
 * Frontend-only dynamic educational animation generator.
 * Converts any explanation text into 3-5 structured visual scenes with:
 * - Clean spoken narration (for speech synthesis and subtitles)
 * - Semantic visual flow layout (flow, cycle, tree, processor, input-output, comparison)
 * - Animated elements with Lucide icons, color gradients, and CSS micro-animations
 * - Domain-aware keyword associations (science, systems, networking, programming, math, general)
 */

// Domain vocabulary dictionary to map concepts to visual icons, colors, and animation styles
const DOMAIN_MAP = [
  // Biology & Nature
  {
    regex: /\b(photosynthesis|chloroplast|chlorophyll)\b/i,
    category: "nature",
    pattern: "input-output",
    items: [
      { id: "sun", label: "Sunlight (Energy)", icon: "sun", color: "text-amber-400 bg-amber-400/20 border-amber-400/40", animation: "animate-spin-slow" },
      { id: "water", label: "Water (H₂O)", icon: "droplet", color: "text-sky-400 bg-sky-400/20 border-sky-400/40", animation: "animate-bounce-subtle" },
      { id: "co2", label: "Carbon Dioxide (CO₂)", icon: "wind", color: "text-slate-300 bg-slate-700/40 border-slate-500/40", animation: "animate-pulse" },
      { id: "leaf", label: "Chloroplast / Leaf", icon: "sprout", color: "text-emerald-400 bg-emerald-400/20 border-emerald-400/40", animation: "pulse-glow-effect" },
      { id: "glucose", label: "Glucose (Food)", icon: "sparkles", color: "text-yellow-300 bg-yellow-300/20 border-yellow-300/40", animation: "animate-pulse" },
      { id: "oxygen", label: "Oxygen (O₂)", icon: "sparkle", color: "text-teal-300 bg-teal-300/20 border-teal-300/40", animation: "animate-float-particle" }
    ]
  },
  {
    regex: /\b(water cycle|evaporation|condensation|precipitation|rain|cloud)\b/i,
    category: "nature",
    pattern: "cycle",
    items: [
      { id: "ocean", label: "Water Reservoir", icon: "waves", color: "text-blue-500 bg-blue-500/20 border-blue-500/40", animation: "animate-pulse" },
      { id: "sun", label: "Solar Heat", icon: "sun", color: "text-amber-400 bg-amber-400/20 border-amber-400/40", animation: "animate-spin-slow" },
      { id: "vapor", label: "Evaporation", icon: "wind", color: "text-sky-300 bg-sky-300/20 border-sky-300/40", animation: "animate-bounce-subtle" },
      { id: "cloud", label: "Condensation", icon: "cloud", color: "text-slate-200 bg-slate-400/20 border-slate-300/40", animation: "animate-pulse" },
      { id: "rain", label: "Precipitation", icon: "cloud-rain", color: "text-cyan-400 bg-cyan-400/20 border-cyan-400/40", animation: "animate-bounce-subtle" }
    ]
  },
  // Systems, OS & Hardware
  {
    regex: /\b(operating system|os|kernel|hardware|cpu|ram|memory|process|storage)\b/i,
    category: "systems",
    pattern: "system",
    items: [
      { id: "user", label: "User & Apps", icon: "smartphone", color: "text-violet-400 bg-violet-400/20 border-violet-400/40", animation: "animate-pulse" },
      { id: "kernel", label: "OS / Kernel", icon: "cpu", color: "text-brand-400 bg-brand-400/20 border-brand-400/40", animation: "pulse-glow-effect" },
      { id: "cpu", label: "CPU Processor", icon: "zap", color: "text-amber-400 bg-amber-400/20 border-amber-400/40", animation: "animate-spin-slow" },
      { id: "ram", label: "RAM (Memory)", icon: "layers", color: "text-sky-400 bg-sky-400/20 border-sky-400/40", animation: "animate-pulse" },
      { id: "disk", label: "Storage Disk", icon: "hard-drive", color: "text-emerald-400 bg-emerald-400/20 border-emerald-400/40", animation: "animate-pulse" }
    ]
  },
  // Networking & Web
  {
    regex: /\b(http|https|network|server|client|browser|api|internet|request|response|dns)\b/i,
    category: "network",
    pattern: "flow",
    items: [
      { id: "client", label: "Web Browser / Client", icon: "laptop", color: "text-blue-400 bg-blue-400/20 border-blue-400/40", animation: "animate-pulse" },
      { id: "req", label: "HTTP Request", icon: "arrow-right", color: "text-amber-400 bg-amber-400/20 border-amber-400/40", animation: "animate-bounce-subtle" },
      { id: "dns", label: "Network Routing", icon: "globe", color: "text-indigo-400 bg-indigo-400/20 border-indigo-400/40", animation: "animate-spin-slow" },
      { id: "server", label: "Web Server", icon: "server", color: "text-purple-400 bg-purple-400/20 border-purple-400/40", animation: "pulse-glow-effect" },
      { id: "db", label: "Database", icon: "database", color: "text-emerald-400 bg-emerald-400/20 border-emerald-400/40", animation: "animate-pulse" },
      { id: "res", label: "Rendered Webpage", icon: "layout", color: "text-cyan-400 bg-cyan-400/20 border-cyan-400/40", animation: "animate-pulse" }
    ]
  },
  // Programming & Algorithms
  {
    regex: /\b(tree|binary tree|recursion|recursive|algorithm|stack|queue|sort|search)\b/i,
    category: "algorithms",
    pattern: "hierarchy",
    items: [
      { id: "root", label: "Root Node", icon: "git-commit", color: "text-brand-400 bg-brand-400/20 border-brand-400/40", animation: "pulse-glow-effect" },
      { id: "left", label: "Left Branch", icon: "git-branch", color: "text-sky-400 bg-sky-400/20 border-sky-400/40", animation: "animate-pulse" },
      { id: "right", label: "Right Branch", icon: "git-branch", color: "text-indigo-400 bg-indigo-400/20 border-indigo-400/40", animation: "animate-pulse" },
      { id: "base", label: "Base Case", icon: "check-circle", color: "text-emerald-400 bg-emerald-400/20 border-emerald-400/40", animation: "animate-bounce-subtle" },
      { id: "result", label: "Computed Result", icon: "terminal", color: "text-teal-300 bg-teal-300/20 border-teal-300/40", animation: "animate-pulse" }
    ]
  },
  // Mathematics & Physics
  {
    regex: /\b(math|equation|calculate|number|formula|physics|gravity|force|energy|velocity|orbit)\b/i,
    category: "math-physics",
    pattern: "math",
    items: [
      { id: "var1", label: "Input Parameters", icon: "hash", color: "text-amber-400 bg-amber-400/20 border-amber-400/40", animation: "animate-pulse" },
      { id: "formula", label: "Formula / Law", icon: "binary", color: "text-indigo-400 bg-indigo-400/20 border-indigo-400/40", animation: "pulse-glow-effect" },
      { id: "calc", label: "Computation / Motion", icon: "activity", color: "text-rose-400 bg-rose-400/20 border-rose-400/40", animation: "animate-spin-slow" },
      { id: "graph", label: "Calculated State", icon: "line-chart", color: "text-emerald-400 bg-emerald-400/20 border-emerald-400/40", animation: "animate-bounce-subtle" }
    ]
  }
];

// Fallback universal items for any general topic
const UNIVERSAL_ELEMENTS = [
  { id: "input", label: "Core Concept", icon: "book-open", color: "text-brand-400 bg-brand-400/20 border-brand-400/40", animation: "pulse-glow-effect" },
  { id: "process", label: "Underlying Mechanism", icon: "cog", color: "text-sky-400 bg-sky-400/20 border-sky-400/40", animation: "animate-spin-slow" },
  { id: "connection", label: "Interactive Flow", icon: "arrow-right", color: "text-amber-400 bg-amber-400/20 border-amber-400/40", animation: "animate-bounce-subtle" },
  { id: "output", label: "Real-World Outcome", icon: "check-circle", color: "text-emerald-400 bg-emerald-400/20 border-emerald-400/40", animation: "animate-pulse" }
];

/**
 * Strips markdown and cleans text for spoken audio and clean display
 */
function cleanTextForNarration(text) {
  if (!text) return "";
  return text
    .replace(/^#+\s+/gm, "") // remove headers
    .replace(/\*\*(.*?)\*\*/g, "$1") // bold
    .replace(/\*(.*?)\*/g, "$1") // italics
    .replace(/`{1,3}[\s\S]*?`{1,3}/g, "") // code blocks
    .replace(/\[(.*?)\]\(.*?\)/g, "$1") // links
    .replace(/[-*]\s+/g, "") // bullet points
    .replace(/^\d+\.\s+/gm, "") // numbering
    .replace(/PERSONALIZED ANSWER [A-B].*?:/gi, "")
    .replace(/STANDARD.*?:/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Splits text into educational sentences
 */
function splitIntoSentences(text) {
  const cleaned = cleanTextForNarration(text);
  if (!cleaned) return [];
  // Split on sentence boundaries
  const rawSentences = cleaned.match(/[^.!?]+[.!?]+/g) || [cleaned];
  return rawSentences
    .map(s => s.trim())
    .filter(s => s.length > 15);
}

/**
 * Detects domain match or fallback
 */
function detectDomain(text, title) {
  const combined = `${title || ""} ${text || ""}`;
  for (const domain of DOMAIN_MAP) {
    if (domain.regex.test(combined)) {
      return domain;
    }
  }
  return {
    category: "general",
    pattern: "flow",
    items: UNIVERSAL_ELEMENTS
  };
}

/**
 * Generates 3 to 5 scenes from any explanation text
 */
export function generateAnimatedScenes(text, title = "Concept Explanation") {
  const sentences = splitIntoSentences(text);
  const domain = detectDomain(text, title);

  // Determine target scene count (between 3 and 5)
  let sceneCount = 4;
  if (sentences.length <= 3) {
    sceneCount = 3;
  } else if (sentences.length >= 6) {
    sceneCount = 5;
  }

  // Chunk sentences across scenes
  const scenes = [];
  const chunkSize = Math.max(1, Math.floor(sentences.length / sceneCount));

  const sceneTitles = [
    { title: "1. Core Definition", badge: "Concept Introduction" },
    { title: "2. Key Components", badge: "Anatomy & Setup" },
    { title: "3. How It Works", badge: "Process & Flow" },
    { title: "4. Real-World Action", badge: "System Behavior" },
    { title: "5. Key Takeaway", badge: "Summary & Lesson" }
  ];

  for (let i = 0; i < sceneCount; i++) {
    const start = i * chunkSize;
    const end = (i === sceneCount - 1) ? sentences.length : (i + 1) * chunkSize;
    const sceneSentences = sentences.slice(start, end);
    const narration = sceneSentences.join(" ") || `Learning about ${title}.`;

    // Pick active elements for this scene based on progress
    const totalItems = domain.items.length;
    let activeElements = [];

    if (domain.pattern === "flow" || domain.pattern === "input-output") {
      if (i === 0) {
        activeElements = [domain.items[0], domain.items[1] || domain.items[0]];
      } else if (i === sceneCount - 1) {
        activeElements = [domain.items[totalItems - 2] || domain.items[0], domain.items[totalItems - 1]];
      } else {
        const midIdx = Math.min(i + 1, totalItems - 1);
        activeElements = domain.items.slice(Math.max(0, midIdx - 1), midIdx + 2);
      }
    } else if (domain.pattern === "cycle") {
      const activeIdx = i % totalItems;
      activeElements = [
        domain.items[activeIdx],
        domain.items[(activeIdx + 1) % totalItems],
        domain.items[(activeIdx + 2) % totalItems]
      ];
    } else {
      activeElements = domain.items.slice(0, Math.min(totalItems, 3 + i));
    }

    scenes.push({
      index: i,
      title: sceneTitles[i]?.title || `Scene ${i + 1}`,
      badge: sceneTitles[i]?.badge || "Explanation Step",
      narration: narration,
      pattern: domain.pattern,
      category: domain.category,
      elements: activeElements.length > 0 ? activeElements : domain.items.slice(0, 3)
    });
  }

  return scenes;
}
