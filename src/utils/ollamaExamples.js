/**
 * Example usage of Ollama client
 * This file demonstrates various ways to use the Ollama API
 */

import {
  generateCompletion,
  generateStreamingCompletion,
  chat,
  isOllamaRunning,
  listModels,
  generateFirestoreSchema,
  getCodingHelp,
  generateReactComponent,
} from "./ollamaClient";

// =====================================================
// Example 1: Simple completion (your original example)
// =====================================================
export async function example1_SimpleCompletion() {
  console.log("Example 1: Generating Firestore schema...");

  const response = await generateCompletion(
    "deepseek-coder:6.7b",
    "Generate a Firestore schema for user progress tracking."
  );

  console.log(response);
  return response;
}

// =====================================================
// Example 2: Using the helper function
// =====================================================
export async function example2_FirestoreSchemaHelper() {
  console.log("Example 2: Using schema helper...");

  const schema = await generateFirestoreSchema(
    "User meditation progress tracking with sessions, duration, timestamps, and mood ratings"
  );

  console.log(schema);
  return schema;
}

// =====================================================
// Example 3: Streaming response
// =====================================================
export async function example3_StreamingResponse() {
  console.log("Example 3: Streaming response...");

  let fullResponse = "";

  await generateStreamingCompletion(
    "deepseek-coder:6.7b",
    "Write a JavaScript function to validate email addresses with detailed comments",
    (chunk) => {
      process.stdout.write(chunk); // Print as it comes
      fullResponse += chunk;
    }
  );

  console.log("\n\nFull response:", fullResponse);
  return fullResponse;
}

// =====================================================
// Example 4: Chat conversation
// =====================================================
export async function example4_ChatConversation() {
  console.log("Example 4: Chat conversation...");

  const messages = [
    {
      role: "system",
      content:
        "You are a helpful coding assistant specializing in React and Firebase.",
    },
    {
      role: "user",
      content: "How do I implement real-time listeners in Firestore?",
    },
  ];

  const response = await chat("deepseek-coder:6.7b", messages);
  console.log(response);
  return response;
}

// =====================================================
// Example 5: Get coding help
// =====================================================
export async function example5_CodingHelp() {
  console.log("Example 5: Getting coding help...");

  const code = `
    const [data, setData] = useState([]);
    useEffect(() => {
      fetchData().then(setData);
    }, []);
  `;

  const answer = await getCodingHelp(
    code,
    "Is there a memory leak in this code? How can I fix it?"
  );

  console.log(answer);
  return answer;
}

// =====================================================
// Example 6: Generate React component
// =====================================================
export async function example6_GenerateComponent() {
  console.log("Example 6: Generating React component...");

  const component = await generateReactComponent(
    "A meditation timer card component that displays session duration, ambient sound selection, and a start button"
  );

  console.log(component);
  return component;
}

// =====================================================
// Example 7: Check Ollama status and list models
// =====================================================
export async function example7_CheckStatus() {
  console.log("Example 7: Checking Ollama status...");

  const isRunning = await isOllamaRunning();
  console.log("Ollama is running:", isRunning);

  if (isRunning) {
    const models = await listModels();
    console.log(
      "Available models:",
      models.map((m) => m.name)
    );
  }

  return { isRunning };
}

// =====================================================
// Example 8: Advanced - Code refactoring
// =====================================================
export async function example8_RefactorCode() {
  console.log("Example 8: Refactoring code...");

  const messyCode = `
    function processUser(user) {
      if (user) {
        if (user.name) {
          if (user.email) {
            return { name: user.name, email: user.email };
          }
        }
      }
      return null;
    }
  `;

  const prompt = `Refactor this code to be cleaner and more readable:

${messyCode}

Requirements:
- Reduce nesting
- Use modern JavaScript
- Add error handling
- Include comments

Return ONLY the refactored code.`;

  const refactored = await generateCompletion("deepseek-coder:6.7b", prompt);
  console.log(refactored);
  return refactored;
}

// =====================================================
// Example 9: Generate test cases
// =====================================================
export async function example9_GenerateTests() {
  console.log("Example 9: Generating test cases...");

  const functionCode = `
    export function calculateMeditationStreak(sessions) {
      if (!sessions || sessions.length === 0) return 0;
      
      let streak = 1;
      for (let i = 1; i < sessions.length; i++) {
        const daysDiff = Math.floor(
          (sessions[i].date - sessions[i-1].date) / (1000 * 60 * 60 * 24)
        );
        if (daysDiff === 1) streak++;
        else break;
      }
      return streak;
    }
  `;

  const prompt = `Generate comprehensive Jest test cases for this function:

${functionCode}

Include:
- Happy path tests
- Edge cases
- Error scenarios
- Clear test descriptions

Return ONLY the test code.`;

  const tests = await generateCompletion("deepseek-coder:6.7b", prompt);
  console.log(tests);
  return tests;
}

// =====================================================
// Run all examples
// =====================================================
export async function runAllExamples() {
  console.log("=".repeat(50));
  console.log("Running all Ollama client examples");
  console.log("=".repeat(50));

  try {
    await example7_CheckStatus();
    await example1_SimpleCompletion();
    await example2_FirestoreSchemaHelper();
    // await example3_StreamingResponse(); // Uncomment to see streaming
    await example4_ChatConversation();
    await example5_CodingHelp();
    await example6_GenerateComponent();
    await example8_RefactorCode();
    await example9_GenerateTests();

    console.log("\n✅ All examples completed!");
  } catch (error) {
    console.error("❌ Error running examples:", error);
  }
}

// Uncomment to run examples:
// runAllExamples();
