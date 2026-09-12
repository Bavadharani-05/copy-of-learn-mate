import { Client } from "@gradio/client";

export const TRANSFORMER_API_URL = "https://bavadharani05-image-analyzer.hf.space/transform";
export const DIRECT_HF_SPACE = "https://bavadharani05-learn-mate.hf.space";

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

      const standardAnswer = (result.data[0] || "").trim();
      const personalizedAnswer = (result.data[1] || "").trim();

      if (!standardAnswer && !personalizedAnswer) {
        throw new Error("Model returned empty responses. Please try rephrasing your question.");
      }

      if (onStatus) onStatus("AI response received!");

      return {
        answer_a: standardAnswer,
        answer_b: personalizedAnswer
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

  if (!response.ok) {
    let errorMessage = `Backend server returned status ${response.status}`;
    try {
      const errorJson = await response.json();
      if (errorJson?.error) {
        errorMessage = errorJson.error;
      }
    } catch {
      const text = await response.text();
      if (text) errorMessage = text;
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();

  if (!data || (!data.answer_a && !data.answer_b)) {
    throw new Error("Backend returned empty responses. Please verify your backend server.");
  }

  if (onStatus) onStatus("AI response received from backend!");

  return {
    answer_a: (data.answer_a || "").trim(),
    answer_b: (data.answer_b || data.answer_a || "").trim()
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
