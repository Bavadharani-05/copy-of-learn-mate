export const TRANSFORMER_API_URL = "https://bavadharani05-image-analyzer.hf.space/transform";

export const responseFormats = {
  simple: "Simple Explanation",
  steps: "Step-by-Step Explanation",
  flashcards: "Flashcards",
  quiz: "Quiz",
  example: "Real-World Example",
  challenge: "Mini Challenge",
  story: "Story Explanation",
  keypoints: "Key Points"
};

export const formatSchemaInstructions = {
  simple: `Simple Explanation. Return compact raw JSON (1 short explanation + 3 key takeaways):
{"type":"simple","title":"...","content":"...","key_points":["...","...","..."]}`,

  steps: `Step-by-Step. Return compact raw JSON (4 concise steps):
{"type":"steps","title":"...","steps":[{"number":1,"title":"...","description":"..."},{"number":2,"title":"...","description":"..."},{"number":3,"title":"...","description":"..."},{"number":4,"title":"...","description":"..."}]}`,

  flashcards: `Flashcards. Return compact raw JSON (3 concise cards):
{"type":"flashcards","title":"...","cards":[{"question":"...","answer":"..."},{"question":"...","answer":"..."},{"question":"...","answer":"..."}]}`,

  quiz: `Quiz. Return compact raw JSON (3 multiple-choice questions with 4 options and 0-based correct_answer):
{"type":"quiz","title":"...","questions":[{"question":"...","options":["A","B","C","D"],"correct_answer":0,"explanation":"..."},{"question":"...","options":["A","B","C","D"],"correct_answer":1,"explanation":"..."},{"question":"...","options":["A","B","C","D"],"correct_answer":2,"explanation":"..."}]}`,

  example: `Real-World Example. Return compact raw JSON (1 scenario + connection + takeaway):
{"type":"example","title":"...","scenario":"...","connection":"...","key_takeaway":"..."}`,

  challenge: `Mini Challenge. Return compact raw JSON (1 challenge + 2 hints + answer):
{"type":"challenge","title":"...","challenge":"...","hints":["Hint 1","Hint 2"],"answer":"...","explanation":"..."}`,

  story: `Story Explanation. Return compact raw JSON (1 short narrative + 1 core lesson):
{"type":"story","title":"...","story":"...","lesson":"..."}`,

  keypoints: `Key Points. Return compact raw JSON (4 concise takeaways):
{"type":"keypoints","title":"...","points":["...","...","...","..."]}`
};

const MAX_SOURCE_CHARS = 3500;

export async function fetchFromHuggingFace(spaceUrl, question, signal) {
  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
      signal
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from backend. Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Backend result:", data);

    if (!data || !data.result || data.result.length < 2) {
      throw new Error("Invalid response structure from backend");
    }

    return {
      answer_a: data.result[0],
      answer_b: data.result[1],
    };

  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Fetch aborted.');
      return;
    }
    console.error("Backend API error:", error);
    throw error;
  }
}

export async function transformResponse(originalAnswer, formatKeyOrDescription, learnerProfile) {
  const formatKey = Object.keys(responseFormats).find(k => 
    k === formatKeyOrDescription || responseFormats[k] === formatKeyOrDescription
  ) || "simple";

  const promptWithSchema = formatSchemaInstructions[formatKey] || formatKeyOrDescription;
  const trimmedAnswer = typeof originalAnswer === "string" 
    ? originalAnswer.slice(0, MAX_SOURCE_CHARS).trim()
    : "";

  console.log("🚀 [Transformer Request] Starting API call for format:", formatKey);
  const startTime = performance.now();

  try {
    const response = await fetch(TRANSFORMER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        original_answer: trimmedAnswer,
        response_format: promptWithSchema,
        learner_profile: (learnerProfile || "").slice(0, 500)
      })
    });

    const elapsedMs = Math.round(performance.now() - startTime);

    if (!response.ok) {
      let errorText = "";
      try {
        errorText = await response.text();
      } catch (e) {}
      throw new Error(`Transformer API error ${response.status}${errorText ? ': ' + errorText : ''}`);
    }

    const data = await response.json();
    if (!data || typeof data.response !== "string") {
      throw new Error("Invalid response structure from Transformer API");
    }

    console.log(`⏱️ [Transformer Response] Completed in ${elapsedMs}ms`);
    return data.response;
  } catch (error) {
    console.error("Response Transformer API error:", error);
    throw error;
  }
}
