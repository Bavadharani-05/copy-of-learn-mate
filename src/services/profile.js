export function generateLearnerProfile(selections) {
  const { color, place, activity, ageGroup, learningPreference } = selections;

  // Trait mappings
  const colorTraits = {
    blue: ["calm", "focused"],
    green: ["natural", "balanced"],
    purple: ["creative", "imaginative"],
    orange: ["energetic", "bold"]
  };

  const placeTraits = {
    garden: ["relaxed", "curious"],
    library: ["focused", "knowledge-oriented"],
    home: ["comfortable", "reflective"],
    restaurant: ["social", "energetic"]
  };

  const activityTraits = {
    playing: ["interactive", "playful"],
    reading: ["analytical", "thoughtful"],
    dancing: ["expressive", "energetic"],
    music: ["creative", "emotional"]
  };

  const learningTraits = {
    "quick-simple": ["efficient"],
    "step-by-step": ["structured"],
    "practice-first": ["applied"],
    "detailed-explanation": ["in-depth"]
  };

  const traitsSet = new Set([
    ...(colorTraits[color.toLowerCase()] || []),
    ...(placeTraits[place.toLowerCase()] || []),
    ...(activityTraits[activity.toLowerCase()] || []),
    ...(learningTraits[learningPreference] || [])
  ]);
  const traits = Array.from(traitsSet);

  // Generate a Character Title
  let characterTitle = "The Mindful Learner 🎯";
  if (activity === "reading" && place === "library") {
    characterTitle = "The Focused Scholar 📚";
  } else if (activity === "playing" && place === "garden") {
    characterTitle = "The Curious Explorer 🌳";
  } else if (activity === "dancing" && place === "restaurant") {
    characterTitle = "The Energetic Pioneer ⚡";
  } else if (activity === "music" && place === "home") {
    characterTitle = "The Reflective Harmonizer 🎵";
  } else {
    const adj = color === "purple" ? "Creative" : color === "blue" ? "Calm" : color === "green" ? "Balanced" : "Bold";
    const noun = activity === "playing" ? "Player" : activity === "reading" ? "Reader" : activity === "dancing" ? "Creator" : "Listener";
    characterTitle = `The ${adj} ${noun} ✨`;
  }

  // Response Style Summary
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

  const responseStyle = `${traits[0] || "custom"} and ${styleSummary}`;

  // Personalized Description
  let description = "";
  if (color === "purple") {
    description = `You thrive on creative, imaginative inputs. With a preference for the ${place} and ${activity}, your learning journey is personalized to balance expression with your ${learningPreference} style.`;
  } else if (color === "blue") {
    description = `You appreciate focused, calm environments. Mapped to the ${place} and ${activity}, your learning is structured to optimize deep focus and clarity using your preferred ${learningPreference} approach.`;
  } else if (color === "green") {
    description = `You value balance and natural flow. Combined with the ${place} and ${activity}, your learning material is curated to feel organic and aligned with your ${learningPreference} preference.`;
  } else {
    description = `You are motivated by bold, energetic themes. Styled around the ${place} and ${activity}, your LearnMate experience will be highly engaging and dynamic, paced for your ${learningPreference} preference.`;
  }

  return {
    color: color.toLowerCase(),
    environment: place.toLowerCase(),
    activity: activity.toLowerCase(),
    ageGroup,
    learningPreference,
    characterTitle,
    traits,
    responseStyle,
    uiTheme: `${color.toLowerCase()}-${place.toLowerCase()}`,
    description
  };
}

export function applyLearnerTheme(profile) {
  if (!profile) return;

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
  let roundedClass = '1.5rem'; // Default 3xl
  if (environment === 'home') {
    roundedClass = '2rem'; // Extra rounded comfortable
  } else if (environment === 'library') {
    roundedClass = '1rem'; // Structured/focused
  } else if (environment === 'garden') {
    roundedClass = '1.75rem'; // Organic rounded
  } else if (environment === 'restaurant') {
    roundedClass = '1.25rem'; // Standard rounded
  }
  document.documentElement.style.setProperty('--theme-card-rounded', roundedClass);

  // Micro animation speed
  let animationDuration = '0.5s';
  if (activity === 'dancing' || environment === 'restaurant') {
    animationDuration = '0.3s'; // Energetic/fast
  } else if (activity === 'music') {
    animationDuration = '0.7s'; // Slow and emotional/relaxed
  } else if (activity === 'playing') {
    animationDuration = '0.4s'; // Snappy/playful
  } else if (activity === 'reading' || environment === 'library') {
    animationDuration = '0.6s'; // Calm & steady
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

  const traits = profile.traits ? profile.traits.join(", ") : "";

  return `Learner Profile:
Age group: ${profile.ageGroup || "Adult"}
Learning preference: ${profile.learningPreference || "Step-by-Step"}
Environment preference: ${profile.environment || "Library"}
Activity preference: ${profile.activity || "Reading"}
Color preference: ${profile.color || "Blue"}
Characteristics: ${traits}

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
