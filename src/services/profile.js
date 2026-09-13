import { generateLearnerCharacter } from './characterEngine.js';

export function generateLearnerProfile(selections = {}) {
  const {
    color = "purple",
    place = "library",
    activity = "reading",
    ageGroup = "Teen",
    learningPreference = "step-by-step"
  } = selections;

  // Use the deterministic character engine
  const charResult = generateLearnerCharacter(selections);

  let styleSummary = "adaptive";
  if (learningPreference === "quick-simple") {
    styleSummary = "concise and direct";
  } else if (learningPreference === "step-by-step") {
    styleSummary = "structured and logical";
  } else if (learningPreference === "practice-first") {
    styleSummary = "applied and example-driven";
  } else {
    styleSummary = "in-depth and comprehensive";
  }

  const responseStyle = `${charResult.traits[0] || "Adaptive"} and ${styleSummary}`;

  return {
    color: color.toLowerCase(),
    environment: place.toLowerCase(),
    activity: activity.toLowerCase(),
    ageGroup,
    learningPreference,
    characterTitle: charResult.characterTitle,
    shortTitle: charResult.shortTitle,
    archetype: charResult.archetype,
    traits: charResult.traits,
    rawTraits: charResult.rawTraits,
    topTraits: charResult.topTraits,
    recommendedFormats: charResult.recommendedFormats,
    responseStyle,
    uiTheme: `${color.toLowerCase()}-${place.toLowerCase()}`,
    description: charResult.description
  };
}

export function resetLearnerTheme() {
  if (typeof document === 'undefined') return;
  const props = [
    '--color-brand-50',
    '--color-brand-100',
    '--color-brand-200',
    '--color-brand-300',
    '--color-brand-400',
    '--color-brand-500',
    '--color-brand-600',
    '--color-brand-700',
    '--color-brand-800',
    '--color-brand-900',
    '--color-brand-glow',
    '--color-brand-text-gradient',
    '--theme-card-rounded',
    '--theme-anim-duration',
    '--theme-bg-mesh'
  ];
  props.forEach(p => document.documentElement.style.removeProperty(p));
}

export function applyLearnerTheme(profile) {
  if (!profile) {
    resetLearnerTheme();
    return;
  }

  const colorThemes = {
    purple: {
      50: '#f5f3ff',
      100: '#ede9fe',
      200: '#ddd6fe',
      300: '#c4b5fd',
      400: '#a78bfa',
      500: '#8b5cf6',
      600: '#7c3aed',
      700: '#6d28d9',
      800: '#5b21b6',
      900: '#4c1d95',
      glow: '0 0 40px -10px rgba(139, 92, 246, 0.15)',
      textGradient: 'linear-gradient(135deg, #c4b5fd 0%, #8b5cf6 50%, #6d28d9 100%)',
    },
    blue: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      glow: '0 0 40px -10px rgba(59, 130, 246, 0.15)',
      textGradient: 'linear-gradient(135deg, #93c5fd 0%, #3b82f6 50%, #1d4ed8 100%)',
    },
    green: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
      glow: '0 0 40px -10px rgba(34, 197, 94, 0.15)',
      textGradient: 'linear-gradient(135deg, #86efac 0%, #22c55e 50%, #15803d 100%)',
    },
    orange: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#f97316',
      600: '#ea580c',
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12',
      glow: '0 0 40px -10px rgba(249, 115, 22, 0.15)',
      textGradient: 'linear-gradient(135deg, #fed7aa 0%, #f97316 50%, #c2410c 100%)',
    }
  };

  const themeColors = colorThemes[profile.color] || colorThemes.purple;
  
  // Apply brand colors to CSS variables
  Object.keys(themeColors).forEach(key => {
    if (key !== 'glow' && key !== 'textGradient') {
      document.documentElement.style.setProperty(`--color-brand-${key}`, themeColors[key]);
    }
  });

  // Apply custom glow & text gradient
  document.documentElement.style.setProperty('--color-brand-glow', themeColors.glow);
  document.documentElement.style.setProperty('--color-brand-text-gradient', themeColors.textGradient);

  // Apply Environment / Activities specific styles
  const environment = profile.environment || "library";
  const activity = profile.activity || "reading";

  // Card rounded corners
  let roundedClass = '1.5rem';
  if (environment === 'home') {
    roundedClass = '2rem';
  } else if (environment === 'library') {
    roundedClass = '1rem';
  } else if (environment === 'garden') {
    roundedClass = '1.75rem';
  } else if (environment === 'restaurant') {
    roundedClass = '1.25rem';
  }
  document.documentElement.style.setProperty('--theme-card-rounded', roundedClass);

  // Micro animation speed
  let animationDuration = '0.5s';
  if (activity === 'dancing' || activity === 'dance' || environment === 'restaurant') {
    animationDuration = '0.3s';
  } else if (activity === 'music') {
    animationDuration = '0.7s';
  } else if (activity === 'playing') {
    animationDuration = '0.4s';
  } else if (activity === 'reading' || environment === 'library') {
    animationDuration = '0.6s';
  }
  document.documentElement.style.setProperty('--theme-anim-duration', animationDuration);

  // Background Mesh customization based on combination
  let meshGradient = '';
  const c = profile.color;
  if (c === 'purple') {
    meshGradient = `
      radial-gradient(at 0% 0%, rgba(139, 92, 246, 0.15) 0px, transparent 50%),
      radial-gradient(at 100% 0%, rgba(56, 189, 248, 0.1) 0px, transparent 50%),
      radial-gradient(at 50% 100%, rgba(244, 114, 182, 0.08) 0px, transparent 50%)
    `;
  } else if (c === 'blue') {
    meshGradient = `
      radial-gradient(at 0% 0%, rgba(59, 130, 246, 0.15) 0px, transparent 50%),
      radial-gradient(at 100% 0%, rgba(16, 185, 129, 0.1) 0px, transparent 50%),
      radial-gradient(at 50% 100%, rgba(29, 78, 216, 0.08) 0px, transparent 50%)
    `;
  } else if (c === 'green') {
    meshGradient = `
      radial-gradient(at 0% 0%, rgba(34, 197, 94, 0.15) 0px, transparent 50%),
      radial-gradient(at 100% 0%, rgba(234, 179, 8, 0.08) 0px, transparent 50%),
      radial-gradient(at 50% 100%, rgba(21, 128, 61, 0.08) 0px, transparent 50%)
    `;
  } else if (c === 'orange') {
    meshGradient = `
      radial-gradient(at 0% 0%, rgba(249, 115, 22, 0.15) 0px, transparent 50%),
      radial-gradient(at 100% 0%, rgba(239, 68, 68, 0.1) 0px, transparent 50%),
      radial-gradient(at 50% 100%, rgba(251, 146, 60, 0.08) 0px, transparent 50%)
    `;
  }
  
  if (environment === 'garden') {
    meshGradient += `, radial-gradient(at 80% 50%, rgba(16, 185, 129, 0.05) 0px, transparent 40%)`;
  } else if (environment === 'library') {
    meshGradient += `, radial-gradient(at 85% 30%, rgba(139, 92, 246, 0.04) 0px, transparent 35%)`;
  } else if (environment === 'home') {
    meshGradient += `, radial-gradient(at 10% 80%, rgba(251, 146, 60, 0.04) 0px, transparent 40%)`;
  } else if (environment === 'restaurant') {
    meshGradient += `, radial-gradient(at 50% 50%, rgba(239, 68, 68, 0.04) 0px, transparent 30%)`;
  }

  document.documentElement.style.setProperty('--theme-bg-mesh', meshGradient);
}

export function buildPersonalizedPrompt(question, profile) {
  if (!profile) return question;

  const traits = Array.isArray(profile.traits) ? profile.traits.join(", ") : "";

  return `Learner Profile:
Age group: ${profile.ageGroup || "Adult"}
Learning character: ${profile.characterTitle || "Adaptive Learner"}
Learning preference: ${profile.learningPreference || "Step-by-Step"}
Environment preference: ${profile.environment || "Library"}
Activity preference: ${profile.activity || "Reading"}
Color preference: ${profile.color || "Blue"}
Learning traits: ${traits}

User Question:
${question}

Instructions:
Generate the answer according to the learner's preferred learning style.
Keep the explanation appropriate for the learner's age group.
Use a ${profile.learningPreference || "Step-by-Step"} style explanation.
Use simple examples where useful.
Do not mention the learner profile in the answer.
Do not claim that the profile scientifically determines the user's personality.`;
}

/**
 * Completely scrubs any age-identifying labels, patronizing references, or user-preference callouts
 * such as "(for an older)", "for an elder", "as you are older", "based on your preference", etc.
 */
export function sanitizeLearnerText(text) {
  if (!text || typeof text !== "string") return "";

  let cleaned = text;

  // 1. Transform parenthetical age/demographic tags that introduce examples into "(for example)"
  // e.g. "(for a older)", "(for an older)", "(for older)", "(for an elder)", "(for older adults)" -> "(for example)"
  cleaned = cleaned.replace(/\s*\((?:for|as|aimed at|tailored for|suited for)?\s*(?:an?\s+)?(?:older|elder|elderly|senior|aged|child|kid|teen|student)\s*(?:person|adult|learner|individual|audience|people)?\)/gi, " (for example)");

  // 2. Transform phrases like "for a older:", "for an older person:", "for an elder:" into "For example:"
  cleaned = cleaned.replace(/\b(?:specifically\s+)?(?:tailored|adapted|designed|explained|written)?\s*(?:for|to|towards)\s+(?:an?\s+)?(?:older|elder|elderly|senior|aged)\s*(?:person|adult|learner|individual|people)?\s*[:,]\s*/gi, "For example, ");

  // 3. Remove mid-sentence age references like "since you are older/an elder", "as you are older/an elder", "being an older person", "as an elder"
  cleaned = cleaned.replace(/\b(?:since|as|because)\s+you\s+are\s+(?:an?\s+)?(?:older|elder|elderly|senior|a senior|aged|a child|a teen)\s*(?:person|adult|learner)?[:,]?\s*/gi, "");
  cleaned = cleaned.replace(/\bas\s+(?:an?\s+)?(?:older|elder|elderly|senior)\s*(?:person|adult|learner)?[:,]?\s*/gi, "");

  // 4. Remove patronizing greetings or addresses like "Hello there, Elder!", "Dear Elder,", "Welcome, Elder!"
  cleaned = cleaned.replace(/^(?:Hello|Hi|Greetings|Dear|Welcome)(?: there)?,?\s+(?:Elder|Senior|Older adult|Child|Teen|Student|Learner)[!.,]?\s*/gim, "");
  cleaned = cleaned.replace(/\b(?:Hello|Hi|Greetings|Dear)\s+(?:Elder|Senior)[!.,]?\s*/gi, "");

  // 5. Remove self-referencing preference phrases like:
  // "Based on your preference for...", "According to your learning style...", "As you prefer...", "In your home environment..."
  cleaned = cleaned.replace(/\b(?:based on|according to|following|in line with|tailored (?:to|for))\s+your\s+(?:learning\s+)?(?:preference|style|profile|level|environment|selection)[^,.\n]*[,.]?\s*/gi, "");
  cleaned = cleaned.replace(/\bas\s+you\s+prefer(?:red)?\s+[^,.\n]*[,.]?\s*/gi, "");
  cleaned = cleaned.replace(/\bfor\s+your\s+preferred\s+[^,.\n]*[,.]?\s*/gi, "");
  cleaned = cleaned.replace(/\bin\s+your\s+(?:home|library|garden|restaurant|study\s+space)\s+environment\s*[:,]?\s*/gi, "");

  // 6. If the response contains an example section/header, address it clearly as example (for example)
  cleaned = cleaned.replace(/^(\s*(?:\*\*)?(?:Everyday\s+|Real-World\s+)?(?:Example|Analogy)(?:\*\*)?\s*:\s*)(?!\s*\(for example\))/gim, "$1(for example) ");

  // 7. Clean up any duplicated "(for example) (for example)"
  cleaned = cleaned.replace(/(?:\(for example\)\s*){2,}/gi, "(for example) ");

  // 8. Clean up stray punctuation, empty parentheses, and excessive whitespace
  cleaned = cleaned
    .replace(/\(\s*\)/g, "")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/(\n\s*)[,:]\s*/g, "$1")
    .trim();

  return cleaned;
}

/**
 * Strips out model-generated metadata headers (Topic, Age Group, Difficulty Level, Learning Style, Environment, etc.)
 * so the response box ONLY displays the genuine explanation without user personality traits.
 */
export function stripPersonaMetadata(text) {
  if (!text || typeof text !== "string") return "";

  let cleaned = text.trim();

  // If there is an explicit **Explanation:** or Explanation: marker after metadata
  const explanationMarkerRegex = /(?:^|\n)\s*(?:\*\*)?(?:Explanation|Answer|Response|Core Explanation)(?:\*\*)?\s*:\s*\n?/i;
  const match = cleaned.match(explanationMarkerRegex);
  if (match) {
    const beforeMarker = cleaned.substring(0, match.index);
    if (/topic|age|difficulty|style|environment|persona|traits|elder|older|child|teen|student/i.test(beforeMarker)) {
      cleaned = cleaned.substring(match.index + match[0].length).trim();
    }
  }

  // Strip any residual leading metadata lines like **Age Group:** Elder, **Difficulty Level:** Moderate, etc.
  cleaned = cleaned.replace(
    /^(?:\s*(?:\*\*)?(?:Topic|Age Group|Age|Difficulty Level|Difficulty|Learning Style|Environment|Persona|Audience|Learning Traits|Character)(?:\*\*)?\s*:[^\n]*\n?)+/gim,
    ""
  );

  // Strip leading separator lines like ---, ***, ___
  cleaned = cleaned.replace(/^(?:\s*[-*_]{3,}\s*\n?)+/g, "").trim();

  // Strip residual leading "**Explanation:**" or "Explanation:" if still at the start
  cleaned = cleaned.replace(/^(?:\*\*)?(?:Explanation|Answer|Response)(?:\*\*)?\s*:\s*\n?/i, "").trim();

  // Thoroughly scrub any remaining preference or demographic phrasing
  cleaned = sanitizeLearnerText(cleaned);

  return cleaned.trim();
}

/**
 * Transforms a standard model explanation into a distinctly structured, personalized answer
 * tailored specifically for the learner's age group, learning preference, and persona.
 */
export function adaptExplanationForLearner(standardText, profile = null, user = null, question = "") {
  if (!standardText || typeof standardText !== "string") return "";

  const cleanStandard = stripPersonaMetadata(standardText);
  if (!cleanStandard) return "";
  const age = (profile?.ageGroup || user?.ageGroup || "Adult").toLowerCase();
  const pref = (profile?.learningPreference || user?.preferredStyles?.[0] || "Step-by-Step").toLowerCase();

  // Clean sentences from standard text
  const rawSentences = cleanStandard
    .replace(/^#+\s.*$/gm, '') // remove markdown headings
    .split(/(?<=[.?!])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 15 && !/^(?:\*\*)?(?:Topic|Age Group|Difficulty|Learning Style|Environment)/i.test(s));

  const coreSentences = rawSentences.slice(0, 5);

  // 1. Child Adaptation: Very simple, playful, metaphor-rich
  if (age.includes("child")) {
    return `🌟 Let's understand this like an exciting adventure (for example)!

Imagine this: ${coreSentences[0] || cleanStandard.slice(0, 160)}

Here are 3 fun things to remember:
• What it does: ${coreSentences[1] || "It works behind the scenes to make things happen."}
• How it works: ${coreSentences[2] || "Step-by-step, pieces come together just like building with LEGO blocks!"}
• Why it matters: ${coreSentences[3] || "Without it, our daily world would look completely different!"}

✨ Fun takeaway: Think of this like a helpful assistant that makes everything run smoothly!`;
  }

  // 2. Step-by-Step Adaptation
  if (pref.includes("step") || pref.includes("structured")) {
    const s1 = coreSentences[0] || cleanStandard.slice(0, 120);
    const s2 = coreSentences[1] || "The mechanism initiates by taking the input conditions and establishing the foundation.";
    const s3 = coreSentences[2] || "Next, internal transformations occur to process and convert data into meaningful results.";
    const s4 = coreSentences[3] || coreSentences[4] || "Finally, the output is produced and integrated into the surrounding system.";

    return `🪜 Step 1: The Core Foundation
${s1}

🪜 Step 2: How It Operates
${s2}

🪜 Step 3: Key Interactions & Process
${s3}

🪜 Step 4: Outcome & Practical Result
${s4}

💡 Summary: Each step builds sequentially upon the previous one to achieve the complete outcome.`;
  }

  // 3. Examples & Real-world Practice Adaptation
  if (pref.includes("practice") || pref.includes("example") || pref.includes("applied")) {
    return `🎯 Real-World Breakdown (for example):

"${coreSentences[0] || cleanStandard.slice(0, 140)}"

🌍 Everyday Example (for example):
Imagine a familiar everyday situation: ${coreSentences[1] || cleanStandard.slice(0, 150)} Just like following a recipe where every ingredient has an exact purpose, this concept functions through predictable inputs and outputs.

🔍 How to apply this example (for example):
• Action 1: Identify the starting inputs (${coreSentences[2] || "the initial state and dependencies"}).
• Action 2: Track the transformational path (${coreSentences[3] || "how energy or logic flows through each component"}).

💡 Practical Insight: Knowing this allows you to solve real problems and predict system behavior with confidence.`;
  }

  // 4. Quick & Simple / Concise Adaptation
  if (pref.includes("quick") || pref.includes("simple") || pref.includes("direct")) {
    return `⚡ Key Takeaway in 3 Points:

• Core Rule: ${coreSentences[0] || cleanStandard.slice(0, 140)}
• Critical Mechanism: ${coreSentences[1] || coreSentences[0]}
• Practical Impact: ${coreSentences[2] || "Gives you a foundational model for analyzing and solving related problems."}

🎯 Bottom Line: In simple terms, this concept ensures that inputs are systematically converted into reliable, predictable outcomes.`;
  }

  // 5. Default Adult / Standard Adaptation (Analytical & In-depth)
  return `💡 Key Insights & Concepts:

${coreSentences[0] || cleanStandard.slice(0, 180)}

Key Observations:
• Operational Logic: ${coreSentences[1] || "The underlying architecture ensures high consistency across varying conditions."}
• Core Principle: ${coreSentences[2] || "Components coordinate seamlessly through defined interfaces and state transitions."}
• Practical Impact: ${coreSentences[3] || "Optimizes resource utilization and provides clear diagnostic clarity."}

🎯 Conceptual takeaway: Focus on the relationship between the primary catalyst and the end-state transition.`;
}

