/**
 * Ollama API Client
 * Provides utilities for interacting with local Ollama models
 */

const OLLAMA_BASE_URL = "http://127.0.0.1:11434";

/**
 * Generate a completion from Ollama
 * @param {string} model - Model name (e.g., "deepseek-coder:6.7b", "codellama")
 * @param {string} prompt - The prompt to send
 * @param {object} options - Additional options
 * @returns {Promise<string>} - The generated response
 */
export async function generateCompletion(model, prompt, options = {}) {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        prompt,
        stream: false, // Set to true for streaming responses
        ...options,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Ollama API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Ollama generation error:", error);
    throw error;
  }
}

/**
 * Generate a streaming completion from Ollama
 * @param {string} model - Model name
 * @param {string} prompt - The prompt to send
 * @param {function} onChunk - Callback for each chunk of data
 * @param {object} options - Additional options
 */
export async function generateStreamingCompletion(
  model,
  prompt,
  onChunk,
  options = {}
) {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        prompt,
        stream: true,
        ...options,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Ollama API error: ${response.status} ${response.statusText}`
      );
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n").filter((line) => line.trim());

      for (const line of lines) {
        try {
          const json = JSON.parse(line);
          if (json.response) {
            onChunk(json.response);
          }
          if (json.done) {
            return;
          }
        } catch (e) {
          // Skip malformed JSON
        }
      }
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Ollama streaming error:", error);
    throw error;
  }
}

/**
 * Chat with Ollama using chat API
 * @param {string} model - Model name
 * @param {array} messages - Array of message objects with role and content
 * @param {object} options - Additional options
 * @returns {Promise<string>} - The assistant's response
 */
export async function chat(model, messages, options = {}) {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        messages,
        stream: false,
        ...options,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Ollama API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.message.content;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Ollama chat error:", error);
    throw error;
  }
}

/**
 * Check if Ollama server is running
 * @returns {Promise<boolean>}
 */
export async function isOllamaRunning() {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/version`, {
      method: "GET",
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * List available models
 * @returns {Promise<array>} - Array of model objects
 */
export async function listModels() {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(
        `Ollama API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.models || [];
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error listing models:", error);
    return [];
  }
}

/**
 * Generate a Firestore schema using DeepSeek Coder
 * @param {string} description - Description of what the schema should track
 * @returns {Promise<string>} - Generated schema code
 */
export async function generateFirestoreSchema(description) {
  const prompt = `Generate a clean Firestore schema in JavaScript for the following requirement:

${description}

Requirements:
- Use proper Firestore data types
- Include field validation rules
- Add JSDoc comments
- Export as a schema object
- Include example usage

Return ONLY the code, no explanations.`;

  return await generateCompletion("deepseek-coder:6.7b", prompt);
}

/**
 * Get coding help from DeepSeek Coder
 * @param {string} code - The code to analyze
 * @param {string} question - The question about the code
 * @returns {Promise<string>} - The answer
 */
export async function getCodingHelp(code, question) {
  const prompt = `Here's some code:

\`\`\`
${code}
\`\`\`

Question: ${question}

Please provide a clear, concise answer.`;

  return await generateCompletion("deepseek-coder:6.7b", prompt);
}

/**
 * Generate React component code
 * @param {string} description - Description of the component
 * @returns {Promise<string>} - Generated component code
 */
export async function generateReactComponent(description) {
  const prompt = `Generate a clean, modern React functional component for:

${description}

Requirements:
- Use React hooks (useState, useEffect as needed)
- Include PropTypes validation
- Add CSS-in-JS or className references
- Follow React best practices
- Include JSDoc comments

Return ONLY the code, no explanations.`;

  return await generateCompletion("deepseek-coder:6.7b", prompt);
}
