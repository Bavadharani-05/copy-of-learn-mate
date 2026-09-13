import { Client } from "@gradio/client";
import { parseAnimationPlan } from "../utils/animationPlanParser";
import { adaptExplanationForLearner, stripPersonaMetadata } from "./profile";

export const TRANSFORMER_API_URL = "https://bavadharani05-image-analyzer.hf.space/transform";
export const DIRECT_HF_SPACE = "https://bavadharani05-learn-mate.hf.space";

/**
 * Safely inspects and extracts both text answer and structured animation plan
 * from potential JSON or mixed-content model outputs.
 */
function extractAnswerAndAnimation(rawOutput) {
  if (!rawOutput) return { answer: "", animation: null };

  if (typeof rawOutput === "object") {
    const ans = rawOutput.answer || rawOutput.answer_b || rawOutput.content || "";
    const anim = rawOutput.animation ? parseAnimationPlan(rawOutput.animation, ans) : null;
    return { answer: ans, animation: anim };
  }

  if (typeof rawOutput === "string") {
    let text = rawOutput.trim();

    // Check if it's JSON or has markdown code fence
    const stripped = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
    const firstBrace = stripped.indexOf("{");
    const lastBrace = stripped.lastIndexOf("}");

    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      try {
        const candidate = stripped.substring(firstBrace, lastBrace + 1);
        const parsed = JSON.parse(candidate);
        if (parsed && (parsed.answer || parsed.animation || parsed.scenes)) {
          const ans = parsed.answer || parsed.content || "";
          const anim = parsed.animation ? parseAnimationPlan(parsed.animation, ans) : (parsed.scenes ? parseAnimationPlan(parsed, ans) : null);
          return {
            answer: ans || text,
            animation: anim
          };
        }
      } catch (e) {
        // Not a JSON payload, proceed with raw text
      }
    }

    return { answer: text, animation: null };
  }

  return { answer: String(rawOutput), animation: null };
}

// Singleton cache for the Gradio Client connection
let cachedClient = null;
let clientConnectingPromise = null;

// In-flight request deduplication map to guarantee AI is called ONLY ONCE per user question
const inFlightRequests = new Map();

export function getTargetSpaceUrl(spaceUrlOrId) {
  // When running in the browser on localhost with Vite, use /hf-proxy to eliminate browser CORS/preflight blocks
  if (typeof window !== "undefined" && window.location) {
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      return `${window.location.origin}/hf-proxy`;
    }
  }

  if (!spaceUrlOrId) return DIRECT_HF_SPACE;
  const trimmed = spaceUrlOrId.trim();
  if (
    trimmed === "Bavadharani05/learn-mate" ||
    trimmed.includes("huggingface.co/spaces/Bavadharani05/learn-mate") ||
    trimmed.includes("bavadharani05-learn-mate.hf.space")
  ) {
    return DIRECT_HF_SPACE;
  }
  const match = trimmed.match(/huggingface\.co\/spaces\/([^\/]+\/[^\/\?#]+)/);
  if (match) return `https://${match[1].replace("/", "-").toLowerCase()}.hf.space`;
  return trimmed;
}

export function getStoredHfToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("learnmate_hf_token") || import.meta.env?.VITE_HF_TOKEN || "";
  }
  return import.meta.env?.VITE_HF_TOKEN || "";
}

export function setStoredHfToken(token) {
  if (typeof window !== "undefined") {
    if (token && token.trim()) {
      localStorage.setItem("learnmate_hf_token", token.trim());
    } else {
      localStorage.removeItem("learnmate_hf_token");
    }
  }
  // Reset cached client connection so next request reconnects with the new token
  cachedClient = null;
  clientConnectingPromise = null;
}

export async function getGradioClient(spaceUrlOrId) {
  if (cachedClient) return cachedClient;
  if (clientConnectingPromise) return clientConnectingPromise;

  const targetSpace = getTargetSpaceUrl(spaceUrlOrId);
  const token = getStoredHfToken();
  const connectOptions = token ? { hf_token: token } : {};

  console.log(`🔌 [Gradio Client] Connecting to Space endpoint: ${targetSpace} ${token ? '(Authenticated with HF Token)' : '(Anonymous)'}...`);

  clientConnectingPromise = (async () => {
    try {
      const client = await Client.connect(targetSpace, connectOptions);
      console.log(`✅ [Gradio Client] Successfully connected to Space: ${targetSpace}`);
      cachedClient = client;
      return client;
    } catch (err) {
      console.warn(`Primary connection to ${targetSpace} failed, attempting direct Space URL fallback...`, err);
      try {
        const fallbackClient = await Client.connect(DIRECT_HF_SPACE, connectOptions);
        console.log(`✅ [Gradio Client] Fallback connection established to: ${DIRECT_HF_SPACE}`);
        cachedClient = fallbackClient;
        return fallbackClient;
      } catch (fallbackErr) {
        console.error(`❌ [Gradio Client] All connection attempts failed:`, fallbackErr);
        throw fallbackErr;
      }
    } finally {
      clientConnectingPromise = null;
    }
  })();

  return clientConnectingPromise;
}

export const responseFormats = {
  simple: "Simple Explanation",
  steps: "Step-by-Step Explanation",
  flashcards: "Flashcards",
  quiz: "Quiz",
  example: "Real-World Example",
  challenge: "Mini Challenge",
  story: "Story Explanation",
  keypoints: "Key Points",
  animation: "Animated Explanation"
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
{"type":"keypoints","title":"...","points":["...","...","...","..."]}`,

  animation: `Animated Explanation Plan. Return compact raw JSON with 3 to 6 progressive scenes:
{"type":"animation","title":"...","environment":"nature|digital network|computer|graph grid|laboratory|classroom|generic","scenes":[{"duration":4,"caption":"...","objects":["..."],"actions":["..."]}]}`
};

const MAX_SOURCE_CHARS = 3500;

export async function fetchFromHuggingFace(spaceUrlOrParams, questionArg, signalArg, onStatusCallback) {
  let spaceUrl = DIRECT_HF_SPACE;
  let question = "";
  let age = "Adult";
  let difficulty = "Medium";
  let learningStyle = "Simple";
  let environment = "Home";
  let signal = null;
  let onStatus = null;

  if (typeof spaceUrlOrParams === "object" && spaceUrlOrParams !== null) {
    spaceUrl = spaceUrlOrParams.spaceUrl || DIRECT_HF_SPACE;
    question = spaceUrlOrParams.question || "";
    age = spaceUrlOrParams.age || "Adult";
    difficulty = spaceUrlOrParams.difficulty || "Medium";
    learningStyle = spaceUrlOrParams.learningStyle || "Simple";
    environment = spaceUrlOrParams.environment || "Home";
    signal = spaceUrlOrParams.signal || signalArg;
    onStatus = spaceUrlOrParams.onStatus || onStatusCallback;
  } else {
    spaceUrl = spaceUrlOrParams || DIRECT_HF_SPACE;
    question = questionArg || "";
    signal = signalArg;
    onStatus = onStatusCallback;
  }

  const cleanQuestion = question.trim();
  if (!cleanQuestion) {
    throw new Error("Question cannot be empty.");
  }

  // Deduplication key to guarantee that concurrent or StrictMode calls fire ONLY ONCE
  const requestKey = `${getTargetSpaceUrl(spaceUrl)}::${cleanQuestion.toLowerCase()}::${age}::${difficulty}::${learningStyle}::${environment}`;

  if (inFlightRequests.has(requestKey)) {
    console.log("⚡ [Gradio Client] Reusing in-flight request for:", cleanQuestion);
    return inFlightRequests.get(requestKey);
  }

  const executionPromise = (async () => {
    try {
      if (onStatus) onStatus("Connecting to Hugging Face Space (Bavadharani05/learn-mate)...");
      const client = await getGradioClient(spaceUrl);

      if (signal?.aborted) {
        throw new DOMException("Request was aborted", "AbortError");
      }

      if (onStatus) onStatus("Submitting question to AI model...");
      console.log("🚀 [Gradio Client] Sending predict request with params:", {
        question: cleanQuestion,
        age,
        difficulty,
        learning_style: learningStyle,
        environment
      });

      const result = await client.predict("/generate_response", {
        question: cleanQuestion,
        age: age,
        difficulty: difficulty,
        learning_style: learningStyle,
        environment: environment
      });

      if (signal?.aborted) {
        throw new DOMException("Request was aborted", "AbortError");
      }

      console.log("🎉 [Gradio Client] Raw model prediction result:", result);

      if (!result || !Array.isArray(result.data) || result.data.length < 2) {
        throw new Error("Invalid response format received from Hugging Face model.");
      }

      let standardAnswer = (result.data[0] || "").trim();
      let personalizedAnswerRaw = (result.data[1] || "").trim();

      if (!standardAnswer && personalizedAnswerRaw) {
        standardAnswer = personalizedAnswerRaw;
      }

      if (!standardAnswer && !personalizedAnswerRaw) {
        throw new Error("Model returned empty responses. Please try rephrasing your question.");
      }

      if (onStatus) onStatus("AI response received!");

      standardAnswer = stripPersonaMetadata(standardAnswer);
      const extracted = extractAnswerAndAnimation(personalizedAnswerRaw);
      let personalizedFinal = stripPersonaMetadata(extracted.answer || personalizedAnswerRaw);

      // Ensure personalized answer is distinctly adapted if identical or empty
      if (!personalizedFinal || personalizedFinal === standardAnswer) {
        personalizedFinal = adaptExplanationForLearner(
          standardAnswer,
          { ageGroup: age, learningPreference: learningStyle, environment },
          null,
          cleanQuestion
        );
      }

      return {
        answer_a: stripPersonaMetadata(standardAnswer),
        answer_b: stripPersonaMetadata(personalizedFinal),
        animation: extracted.animation || null
      };
    } catch (error) {
      if (error.name === 'AbortError' || signal?.aborted) {
        console.log('Fetch aborted.');
        throw error;
      }
      console.error("❌ Hugging Face Gradio API error:", error);
      throw error;
    } finally {
      inFlightRequests.delete(requestKey);
    }
  })();

  inFlightRequests.set(requestKey, executionPromise);
  return executionPromise;
}

/**
 * Safely reads the response body stream once as text, then attempts to parse as JSON.
 * Returns { text, data } where data is parsed JSON (or null if parsing failed).
 */
async function readResponsePayload(response) {
  let text = "";
  try {
    text = await response.text();
  } catch (err) {
    console.warn("Could not read response body stream:", err);
    text = "";
  }

  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  return { text, data };
}

/**
 * Extracts a meaningful error message from parsed response data, raw text, or HTTP status.
 */
function extractErrorMessage(data, text, response) {
  if (data && typeof data === "object") {
    if (data.error && typeof data.error === "string") return data.error;
    if (data.error && typeof data.error === "object" && data.error.message) return data.error.message;
    if (data.message && typeof data.message === "string") return data.message;
    if (data.detail && typeof data.detail === "string") return data.detail;
  } else if (typeof data === "string" && data.trim()) {
    return data.trim();
  }

  if (text && typeof text === "string") {
    const trimmed = text.trim();
    if (trimmed) {
      if (trimmed.startsWith("<") && (trimmed.includes("<!DOCTYPE") || trimmed.includes("<html"))) {
        const titleMatch = trimmed.match(/<title>([^<]+)<\/title>/i);
        const preMatch = trimmed.match(/<pre>([^<]+)<\/pre>/i) || trimmed.match(/<h1[^>]*>([^<]+)<\/h1>/i);
        const extracted = [titleMatch?.[1], preMatch?.[1]].filter(Boolean).join(" - ");
        if (extracted) {
          return `Server error (${response.status}): ${extracted.trim()}`;
        }
      }
      return trimmed;
    }
  }

  return `Backend server returned status ${response.status}${response.statusText ? ` (${response.statusText})` : ""}`;
}

export async function getPersonalizedAnswer(params) {
  const question = typeof params === "string" ? params : params?.question || "";
  const age = params?.age || "Adult";
  const difficulty = params?.difficulty || "Medium";
  const learningStyle = params?.learningStyle || params?.learning_style || "Simple";
  const environment = params?.environment || "Home";
  const signal = params?.signal || null;
  const onStatus = params?.onStatus || null;

  const cleanQuestion = question.trim();
  if (!cleanQuestion) {
    throw new Error("Question cannot be empty.");
  }

  if (onStatus) onStatus("Connecting to backend server (/get-personalized-answer)...");

  console.log("🚀 [Backend Client] Calling /api/get-personalized-answer with:", {
    question: cleanQuestion,
    age,
    difficulty,
    learningStyle,
    environment
  });

  const response = await fetch("/api/get-personalized-answer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    signal,
    body: JSON.stringify({
      question: cleanQuestion,
      age,
      difficulty,
      learningStyle,
      environment
    })
  });

  // Read response stream exactly once
  const { text, data } = await readResponsePayload(response);

  if (!response.ok) {
    const errorMessage = extractErrorMessage(data, text, response);
    throw new Error(errorMessage);
  }

  if (!data || (!data.answer_a && !data.answer_b && !data.answer)) {
    if (text && text.trim()) {
      const extracted = extractAnswerAndAnimation(text);
      return {
        answer_a: text.trim(),
        answer_b: extracted.answer || text.trim(),
        animation: extracted.animation || null
      };
    }
    throw new Error("Backend returned empty responses. Please verify your backend server.");
  }

  if (onStatus) onStatus("AI response received from backend!");

  let rawB = (data.answer_b || "").trim();
  let rawA = (data.answer_a || "").trim();

  // If backend returns single explanation (e.g. data.answer or data.result), assign to standard answer rawA
  if (!rawA && (data.answer || data.result)) {
    rawA = (data.answer || data.result).trim();
  }

  // If rawA was not populated but rawB was, assign rawA
  if (!rawA && rawB) {
    rawA = rawB;
  }

  let animationPlan = data.animation ? parseAnimationPlan(data.animation, rawB || rawA) : null;

  if (!animationPlan && typeof rawB === "string") {
    const extracted = extractAnswerAndAnimation(rawB);
    if (extracted.animation) {
      animationPlan = extracted.animation;
      rawB = extracted.answer || rawB;
    }
  }

  rawA = stripPersonaMetadata(rawA);
  rawB = stripPersonaMetadata(rawB);

  // Guarantee that personalized answer rawB is distinct from standard answer rawA
  if (!rawB || rawB === rawA) {
    rawB = adaptExplanationForLearner(
      rawA,
      { ageGroup: age, learningPreference: learningStyle, environment },
      null,
      cleanQuestion
    );
  }

  return {
    answer_a: stripPersonaMetadata(rawA),
    answer_b: stripPersonaMetadata(rawB),
    animation: animationPlan
  };
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

    // Read response stream exactly once
    const { text, data } = await readResponsePayload(response);

    if (!response.ok) {
      const errorDetail = extractErrorMessage(data, text, response);
      throw new Error(`Transformer API error (${response.status}): ${errorDetail}`);
    }

    if (data && typeof data.response === "string") {
      console.log(`⏱️ [Transformer Response] Completed in ${elapsedMs}ms`);
      return data.response;
    }

    // Fallback to raw text if JSON doesn't contain .response or if parsing failed
    if (text && text.trim()) {
      console.log(`⏱️ [Transformer Response] Completed in ${elapsedMs}ms (using raw text fallback)`);
      return text.trim();
    }

    throw new Error("Invalid response structure from Transformer API");
  } catch (error) {
    console.error("Response Transformer API error:", error);
    throw error;
  }
}

/**
 * Requests an animation plan from Qwen/Transformer API, with automatic fallback
 * to the dynamic local animation generator.
 */
export async function fetchAnimationPlan(explanationText, title = "Concept Explanation", learnerProfile = "") {
  try {
    const learnerProfileText = typeof learnerProfile === "string"
      ? learnerProfile
      : `Age: ${learnerProfile?.ageGroup || "Adult"}, Style: ${learnerProfile?.learningPreference || "Visual"}`;

    const response = await transformResponse(
      explanationText,
      "animation",
      learnerProfileText
    );

    return parseAnimationPlan(response, explanationText, title);
  } catch (err) {
    console.warn("Could not fetch animation plan from Transformer API, using dynamic local generator:", err);
    return parseAnimationPlan(null, explanationText, title);
  }
}
