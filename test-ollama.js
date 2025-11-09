#!/usr/bin/env node

/**
 * Quick test script for Ollama integration
 * Run with: node test-ollama.js
 */

const OLLAMA_BASE_URL = "http://127.0.0.1:11434";

async function testOllamaHealth() {
  console.log("🔍 Testing Ollama health...");
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/version`);
    const data = await response.json();
    console.log("✅ Ollama is running:", data.version);
    return true;
  } catch (error) {
    console.error("❌ Ollama is not running:", error.message);
    return false;
  }
}

async function testListModels() {
  console.log("\n📋 Listing available models...");
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
    const data = await response.json();
    console.log(`✅ Found ${data.models.length} model(s):`);
    data.models.forEach((model) => {
      console.log(
        `   - ${model.name} (${(model.size / 1024 / 1024 / 1024).toFixed(
          2
        )} GB)`
      );
    });
    return data.models.length > 0;
  } catch (error) {
    console.error("❌ Failed to list models:", error.message);
    return false;
  }
}

async function testGeneration() {
  console.log("\n🤖 Testing code generation...");
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-coder:6.7b",
        prompt:
          "Write a simple JavaScript function to calculate the factorial of a number. Only respond with the code.",
        stream: false,
      }),
    });

    const data = await response.json();
    console.log("✅ Generated code:");
    console.log("─".repeat(50));
    console.log(data.response.trim());
    console.log("─".repeat(50));
    return true;
  } catch (error) {
    console.error("❌ Failed to generate code:", error.message);
    return false;
  }
}

async function testFirestoreSchema() {
  console.log("\n📊 Testing Firestore schema generation...");
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-coder:6.7b",
        prompt: `Generate a Firestore schema for a meditation tracking app. Include collections for users, sessions, and progress. Respond with only the schema in JavaScript/JSON format.`,
        stream: false,
      }),
    });

    const data = await response.json();
    console.log("✅ Generated schema:");
    console.log("─".repeat(50));
    console.log(data.response.trim());
    console.log("─".repeat(50));
    return true;
  } catch (error) {
    console.error("❌ Failed to generate schema:", error.message);
    return false;
  }
}

async function runAllTests() {
  console.log("🚀 Starting Ollama Integration Tests\n");
  console.log("=".repeat(50));

  const results = [];

  // Test 1: Health check
  results.push(await testOllamaHealth());

  // Test 2: List models
  results.push(await testListModels());

  // Test 3: Code generation
  results.push(await testGeneration());

  // Test 4: Schema generation
  results.push(await testFirestoreSchema());

  // Summary
  console.log("\n" + "=".repeat(50));
  const passed = results.filter((r) => r).length;
  const total = results.length;

  if (passed === total) {
    console.log(`\n✅ All tests passed! (${passed}/${total})`);
    console.log("\n🎉 Ollama integration is working perfectly!");
    console.log("\n📚 Next steps:");
    console.log("   1. Access DevTools at: /dev-tools (requires admin login)");
    console.log("   2. Try generating schemas and components");
    console.log("   3. Import ollamaClient.js in your code");
    console.log("   4. Check OLLAMA_INTEGRATION.md for full documentation");
  } else {
    console.log(`\n⚠️  ${passed}/${total} tests passed`);
    console.log("\n🔧 Troubleshooting:");
    console.log("   1. Ensure Ollama is running: brew services start ollama");
    console.log("   2. Check if model is installed: ollama list");
    console.log("   3. Pull DeepSeek Coder: ollama pull deepseek-coder:6.7b");
  }

  console.log("\n" + "=".repeat(50));
}

// Run tests
runAllTests().catch((error) => {
  console.error("\n💥 Fatal error:", error);
  process.exit(1);
});
