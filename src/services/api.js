
export async function fetchFromHuggingFace(spaceUrl, question, signal) {
  try {
    // Calling the proxied backend endpoint (or direct localhost:3001 if CORS is allowed)
    // Using '/api/generate' to automatically route via Vite proxy to localhost:3001/generate
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