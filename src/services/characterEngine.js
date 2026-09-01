/**
 * Composable Trait Scoring and Dynamic Character Generation Engine.
 * Replaces hardcoded character titles with deterministic trait-driven character mappings.
 */

export function calculateTraits(selections = {}) {
  const {
    color = "",
    place = "",
    activity = "",
    ageGroup = "",
    learningPreference = ""
  } = selections;

  const c = (color || "").toLowerCase().trim();
  const p = (place || "").toLowerCase().trim();
  const a = (activity || "").toLowerCase().trim();
  const pref = (learningPreference || "").toLowerCase().trim();
  const age = (ageGroup || "").toLowerCase().trim();

  // 10 Core Educational Learning Traits
  const traits = {
    focused: 0,
    curious: 0,
    interactive: 0,
    creative: 0,
    exploratory: 0,
    practical: 0,
    structured: 0,
    energetic: 0,
    calm: 0,
    challengeSeeking: 0
  };

  // Place contributions
  if (p === "library") {
    traits.focused += 3;
    traits.structured += 3;
    traits.calm += 2;
    traits.curious += 1;
  } else if (p === "garden") {
    traits.exploratory += 3;
    traits.curious += 3;
    traits.calm += 2;
    traits.creative += 1;
  } else if (p === "home") {
    traits.calm += 3;
    traits.structured += 2;
    traits.focused += 1;
    traits.creative += 1;
  } else if (p === "restaurant") {
    traits.practical += 3;
    traits.interactive += 2;
    traits.creative += 1;
    traits.energetic += 1;
  }

  // Activity contributions
  if (a === "reading") {
    traits.focused += 3;
    traits.structured += 2;
    traits.curious += 2;
    traits.calm += 1;
  } else if (a === "playing") {
    traits.interactive += 3;
    traits.challengeSeeking += 3;
    traits.energetic += 2;
    traits.curious += 1;
  } else if (a === "dancing" || a === "dance") {
    traits.energetic += 3;
    traits.creative += 3;
    traits.interactive += 2;
  } else if (a === "music") {
    traits.creative += 3;
    traits.calm += 2;
    traits.curious += 1;
    traits.interactive += 1;
  }

  // Color contributions (subtle aesthetic affinity)
  if (c === "purple") {
    traits.creative += 1;
    traits.curious += 1;
  } else if (c === "blue") {
    traits.calm += 1;
    traits.focused += 1;
  } else if (c === "green") {
    traits.exploratory += 1;
    traits.calm += 1;
  } else if (c === "orange") {
    traits.energetic += 1;
    traits.practical += 1;
  }

  // Learning preference contributions
  if (pref === "step-by-step") {
    traits.structured += 3;
    traits.focused += 2;
  } else if (pref === "quick-simple") {
    traits.practical += 3;
    traits.focused += 1;
  } else if (pref === "practice-first") {
    traits.interactive += 3;
    traits.challengeSeeking += 2;
  } else if (pref === "detailed-explanation") {
    traits.curious += 2;
    traits.structured += 2;
    traits.focused += 2;
  }

  // Age group adjustments
  if (age.includes("child")) {
    traits.interactive += 1;
    traits.curious += 1;
  } else if (age.includes("teen")) {
    traits.creative += 1;
    traits.curious += 1;
  } else if (age.includes("adult") || age.includes("college")) {
    traits.practical += 1;
    traits.structured += 1;
  } else if (age.includes("elder") || age.includes("older") || age.includes("senior")) {
    traits.calm += 1;
    traits.structured += 1;
  }

  return traits;
}

export function getTopTraits(traits, count = 3) {
  return Object.entries(traits)
    .sort((a, b) => b[1] - a[1])
    .filter(([_, score]) => score > 0)
    .slice(0, count)
    .map(([trait, score]) => ({ trait, score }));
}

export function getCharacterFromTraits(topTraits = [], selections = {}) {
  if (topTraits.length === 0) {
    return {
      title: "Adaptive Learner 🌟",
      shortTitle: "Adaptive Learner",
      archetype: "adaptive"
    };
  }

  const t1 = topTraits[0]?.trait || "";
  const t2 = topTraits[1]?.trait || "";
  const t3 = topTraits[2]?.trait || "";
  const traitSet = new Set([t1, t2, t3]);

  const p = (selections.place || "").toLowerCase();
  const a = (selections.activity || "").toLowerCase();

  // Deterministic rule-based trait mapping
  if (traitSet.has("focused") && (traitSet.has("structured") || a === "reading" || p === "library")) {
    return {
      title: "The Focused Scholar 📚",
      shortTitle: "Focused Scholar",
      archetype: "focused-scholar"
    };
  }

  if ((traitSet.has("exploratory") || traitSet.has("curious")) && (traitSet.has("interactive") || p === "garden")) {
    return {
      title: "The Curious Explorer 🌿",
      shortTitle: "Curious Explorer",
      archetype: "curious-explorer"
    };
  }

  if (traitSet.has("challengeSeeking") || (traitSet.has("interactive") && a === "playing")) {
    return {
      title: "The Challenge Seeker 🎯",
      shortTitle: "Challenge Seeker",
      archetype: "challenge-seeker"
    };
  }

  if (traitSet.has("creative") && (traitSet.has("energetic") || a === "dancing" || a === "dance")) {
    return {
      title: "The Creative Spark 🎨",
      shortTitle: "Creative Spark",
      archetype: "creative-spark"
    };
  }

  if (traitSet.has("creative") && (traitSet.has("calm") || a === "music")) {
    return {
      title: "The Creative Storyteller 📖",
      shortTitle: "Creative Storyteller",
      archetype: "creative-storyteller"
    };
  }

  if (traitSet.has("practical") && (traitSet.has("interactive") || p === "restaurant")) {
    return {
      title: "The Practical Thinker 💡",
      shortTitle: "Practical Thinker",
      archetype: "practical-thinker"
    };
  }

  if (traitSet.has("calm") && (traitSet.has("focused") || p === "home")) {
    return {
      title: "The Calm Knowledge Seeker 💙",
      shortTitle: "Calm Knowledge Seeker",
      archetype: "calm-knowledge-seeker"
    };
  }

  if (traitSet.has("exploratory") && traitSet.has("creative")) {
    return {
      title: "The Discovery Seeker 🚀",
      shortTitle: "Discovery Seeker",
      archetype: "discovery-seeker"
    };
  }

  if (traitSet.has("energetic") || traitSet.has("interactive")) {
    return {
      title: "The Energetic Learner ⚡",
      shortTitle: "Energetic Learner",
      archetype: "energetic-learner"
    };
  }

  if (traitSet.has("structured") || traitSet.has("curious")) {
    return {
      title: "The Knowledge Seeker 🔎",
      shortTitle: "Knowledge Seeker",
      archetype: "knowledge-seeker"
    };
  }

  return {
    title: "Adaptive Learner 🌟",
    shortTitle: "Adaptive Learner",
    archetype: "adaptive"
  };
}

export function getCharacterDescription(characterObj, selections = {}, topTraits = []) {
  const { archetype } = characterObj;

  switch (archetype) {
    case "focused-scholar":
      return `You enjoy clear, structured explanations and exploring ideas at your own pace through deep, focused learning.`;
    case "curious-explorer":
      return `You enjoy discovering new ideas through natural exploration, vivid examples, and engaging interactive experiences.`;
    case "challenge-seeker":
      return `You learn best when complex ideas become interactive challenges and puzzles that you can actively solve.`;
    case "creative-spark":
      return `You thrive when connecting concepts through creative expressions, dynamic energy, and intuitive visual models.`;
    case "creative-storyteller":
      return `You absorb concepts naturally through storytelling, harmonious pacing, and creative metaphorical analogies.`;
    case "practical-thinker":
      return `You prefer practical, real-world examples and clear applications that connect classroom ideas to everyday life.`;
    case "calm-knowledge-seeker":
      return `You prefer clear, comfortable, and tranquil learning experiences that let you reflect deeply on concepts.`;
    case "discovery-seeker":
      return `You are driven by broad exploration, connecting diverse ideas through curiosity and creative discovery.`;
    case "energetic-learner":
      return `You enjoy fast-paced, interactive, and stimulating learning sessions that keep your momentum high.`;
    case "knowledge-seeker":
      return `You value thorough, well-organized explanations that systematically answer your questions from the ground up.`;
    case "adaptive":
    default:
      return `Your LearnMate experience is custom-tailored to balance your preferences and guide your learning effectively.`;
  }
}

export function getRecommendedFormats(archetype) {
  switch (archetype) {
    case "focused-scholar":
      return ["steps", "flashcards", "keypoints", "simple"];
    case "challenge-seeker":
      return ["quiz", "challenge", "flashcards"];
    case "curious-explorer":
      return ["example", "quiz", "story", "challenge"];
    case "creative-spark":
    case "creative-storyteller":
      return ["story", "example", "flashcards", "challenge"];
    case "practical-thinker":
      return ["example", "steps", "quiz", "keypoints"];
    case "calm-knowledge-seeker":
      return ["simple", "keypoints", "story", "steps"];
    case "discovery-seeker":
    case "energetic-learner":
      return ["quiz", "challenge", "example", "steps"];
    default:
      return ["simple", "steps", "flashcards", "quiz"];
  }
}

export const TRAIT_LABELS = {
  focused: "🧠 Focused",
  curious: "🔎 Curious",
  interactive: "⚡ Interactive",
  creative: "🎨 Creative",
  exploratory: "🧭 Exploratory",
  practical: "💡 Practical",
  structured: "🎯 Structured",
  energetic: "🔥 Energetic",
  calm: "🌿 Calm",
  challengeSeeking: "🏆 Challenge-seeking"
};

export function generateLearnerCharacter(selections = {}) {
  const traits = calculateTraits(selections);
  const topTraits = getTopTraits(traits, 3);
  const characterObj = getCharacterFromTraits(topTraits, selections);
  const description = getCharacterDescription(characterObj, selections, topTraits);
  const recommendedFormats = getRecommendedFormats(characterObj.archetype);

  const traitLabels = topTraits.map(t => TRAIT_LABELS[t.trait] || t.trait);

  console.log("🎯 [Character Engine] Selections:", selections);
  console.log("📊 [Character Engine] Top Traits:", topTraits);
  console.log("✨ [Character Engine] Character:", characterObj.title);

  return {
    characterTitle: characterObj.title,
    shortTitle: characterObj.shortTitle,
    archetype: characterObj.archetype,
    description,
    traits: traitLabels,
    rawTraits: traits,
    topTraits,
    recommendedFormats
  };
}
