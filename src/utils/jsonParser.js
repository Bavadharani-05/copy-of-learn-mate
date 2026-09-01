/**
 * Utility to extract, parse, and validate structured JSON responses
 * from the Qwen Response Transformer model.
 */

export function parseTransformerResponse(rawResponse, requestedFormat = "simple") {
  if (!rawResponse) {
    return null;
  }

  // If already an object
  if (typeof rawResponse === "object" && rawResponse !== null) {
    return normalizeData(rawResponse, requestedFormat);
  }

  if (typeof rawResponse !== "string") {
    return null;
  }

  let text = rawResponse.trim();

  // 1. Strip markdown code fences (```json ... ``` or ``` ... ```)
  text = text.replace(/^```(?:json)?\s*/i, "");
  text = text.replace(/\s*```$/i, "");
  text = text.trim();

  // 2. Try parsing direct cleaned text
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object") {
      return normalizeData(parsed, requestedFormat);
    }
  } catch (e) {
    // Continue to substring extraction
  }

  // 3. Try to extract JSON object from surrounding prose { ... }
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    const candidate = text.substring(firstBrace, lastBrace + 1);
    try {
      const parsed = JSON.parse(candidate);
      if (parsed && typeof parsed === "object") {
        return normalizeData(parsed, requestedFormat);
      }
    } catch (e) {
      console.warn("Extracted candidate failed to parse:", e);
    }
  }

  // 4. Fallback: create structured object from plain text
  return createFallbackStructure(text, requestedFormat);
}

function normalizeData(data, requestedFormat) {
  // Infer type if missing
  let type = (data.type || "").toLowerCase().trim();
  if (!type) {
    if (data.cards && Array.isArray(data.cards)) type = "flashcards";
    else if (data.questions && Array.isArray(data.questions)) type = "quiz";
    else if (data.steps && Array.isArray(data.steps)) type = "steps";
    else if (data.challenge || data.hints) type = "challenge";
    else if (data.scenario || data.connection) type = "example";
    else if (data.story || data.lesson) type = "story";
    else if (data.points && Array.isArray(data.points)) type = "keypoints";
    else type = requestedFormat || "simple";
  }

  // Normalize format types
  if (type === "step-by-step" || type === "step_by_step") type = "steps";
  if (type === "flashcard") type = "flashcards";
  if (type === "real-world-example" || type === "real_world_example") type = "example";
  if (type === "mini-challenge" || type === "mini_challenge") type = "challenge";
  if (type === "story-explanation" || type === "story_explanation") type = "story";
  if (type === "key-points" || type === "key_points") type = "keypoints";

  const title = data.title || getDefaultTitle(type);

  switch (type) {
    case "flashcards":
      return {
        type: "flashcards",
        title,
        cards: Array.isArray(data.cards) ? data.cards.map((c, i) => ({
          question: c.question || c.q || `Question ${i + 1}`,
          answer: c.answer || c.a || "Answer details..."
        })) : []
      };

    case "quiz":
      return {
        type: "quiz",
        title,
        questions: Array.isArray(data.questions) ? data.questions.map((q, i) => ({
          question: q.question || q.q || `Question ${i + 1}`,
          options: Array.isArray(q.options) && q.options.length >= 2 ? q.options : ["Option A", "Option B", "Option C", "Option D"],
          correct_answer: typeof q.correct_answer === "number" ? q.correct_answer : 0,
          explanation: q.explanation || "Detailed explanation of the correct choice."
        })) : []
      };

    case "steps":
      return {
        type: "steps",
        title,
        steps: Array.isArray(data.steps) ? data.steps.map((s, i) => ({
          number: s.number || i + 1,
          title: s.title || `Step ${i + 1}`,
          description: s.description || s.content || s.text || ""
        })) : []
      };

    case "challenge":
      return {
        type: "challenge",
        title,
        challenge: data.challenge || data.problem || data.question || "Challenge problem statement...",
        hints: Array.isArray(data.hints) ? data.hints : (data.hint ? [data.hint] : ["Think about the foundational concepts.", "Review the key relationships."]),
        answer: data.answer || data.solution || "Challenge solution...",
        explanation: data.explanation || "Explanation of the solution."
      };

    case "example":
      return {
        type: "example",
        title,
        scenario: data.scenario || data.example || data.story || "Real-world situation...",
        connection: data.connection || data.explanation || "How this applies the underlying concept...",
        key_takeaway: data.key_takeaway || data.takeaway || data.summary || "Core takeaway to remember."
      };

    case "story":
      return {
        type: "story",
        title,
        story: data.story || data.content || data.narrative || "Narrative story...",
        lesson: data.lesson || data.moral || data.takeaway || "The core lesson learned."
      };

    case "keypoints":
      return {
        type: "keypoints",
        title,
        points: Array.isArray(data.points) ? data.points : (Array.isArray(data.key_points) ? data.key_points : [data.points || "Key takeaway"])
      };

    case "simple":
    default:
      return {
        type: "simple",
        title,
        content: data.content || data.explanation || data.text || "",
        key_points: Array.isArray(data.key_points) ? data.key_points : (Array.isArray(data.points) ? data.points : [])
      };
  }
}

function getDefaultTitle(type) {
  switch (type) {
    case "flashcards": return "Interactive Flashcards";
    case "quiz": return "Concept Mastery Quiz";
    case "steps": return "Step-by-Step Breakdown";
    case "challenge": return "Mini Concept Challenge";
    case "example": return "Real-World Application";
    case "story": return "Illustrated Story";
    case "keypoints": return "Essential Key Points";
    case "simple": default: return "Simple Explanation";
  }
}

function createFallbackStructure(rawText, formatKey) {
  console.log("Creating fallback structure for:", formatKey);
  const clean = rawText.trim();

  if (formatKey === "flashcards") {
    // Parse Q&A pairs or bullet points into cards
    const lines = clean.split("\n").filter(l => l.trim().length > 0);
    const cards = [];
    for (let i = 0; i < lines.length; i += 2) {
      cards.push({
        question: lines[i].replace(/^Q:\s*|^\d+[\.\)]\s*|^-\s*/i, "").trim(),
        answer: (lines[i + 1] || lines[i]).replace(/^A:\s*/i, "").trim()
      });
    }
    if (cards.length === 0) {
      cards.push({ question: "Core Concept", answer: clean });
    }
    return { type: "flashcards", title: "Key Concept Flashcards", cards: cards.slice(0, 5) };
  }

  if (formatKey === "steps") {
    const steps = clean.split(/\n(?=\d+[\.\)]|\bStep\s+\d+)/i)
      .filter(s => s.trim().length > 0)
      .map((s, i) => {
        const parts = s.replace(/^\d+[\.\)]\s*|^Step\s+\d+[:\-\s]*/i, "").split(/:\s+|\n/);
        return {
          number: i + 1,
          title: parts.length > 1 ? parts[0].trim() : `Step ${i + 1}`,
          description: (parts.length > 1 ? parts.slice(1).join(" ") : parts[0]).trim()
        };
      });
    return { type: "steps", title: "Step-by-Step Guide", steps: steps.length > 0 ? steps : [{ number: 1, title: "Process", description: clean }] };
  }

  if (formatKey === "keypoints") {
    const points = clean.split(/\n(?=[•\-\*\d+])|\n\n/)
      .map(p => p.replace(/^[•\-\*\d+\.\)]\s*/, "").trim())
      .filter(p => p.length > 0);
    return { type: "keypoints", title: "Essential Key Points", points: points.length > 0 ? points : [clean] };
  }

  if (formatKey === "challenge") {
    return {
      type: "challenge",
      title: "Mini Concept Challenge",
      challenge: clean,
      hints: ["Think about the foundational concepts mentioned in the explanation.", "Consider the sequence of cause and effect."],
      answer: "Review the key principles in the main explanation.",
      explanation: clean
    };
  }

  if (formatKey === "example") {
    return {
      type: "example",
      title: "Real-World Application",
      scenario: clean,
      connection: "This scenario directly reflects the core mechanism of the concept.",
      key_takeaway: "Notice how these principles operate in everyday systems."
    };
  }

  if (formatKey === "story") {
    return {
      type: "story",
      title: "Narrative Explanation",
      story: clean,
      lesson: "Understanding fundamental processes unlocks deeper scientific insight."
    };
  }

  return {
    type: "simple",
    title: "Simple Explanation",
    content: clean,
    key_points: []
  };
}
