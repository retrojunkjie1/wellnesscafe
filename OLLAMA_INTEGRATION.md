# Ollama Integration Guide

This project includes local AI development tools powered by **Ollama** and **DeepSeek Coder**.

## What's Included

### 1. Ollama Client (`src/utils/ollamaClient.js`)

A comprehensive utility module for interacting with local Ollama AI models:

- **`generateCompletion(model, prompt, options)`** - Basic completion API
- **`generateStreamingCompletion(model, prompt, onChunk, options)`** - Real-time streaming responses
- **`chat(model, messages, options)`** - Chat API with conversation history
- **`isOllamaRunning()`** - Check if Ollama server is available
- **`listModels()`** - List all installed models
- **`generateFirestoreSchema(description)`** - Generate Firestore schemas
- **`getCodingHelp(code, question)`** - Get help with your code
- **`generateReactComponent(description)`** - Generate React components

### 2. Examples (`src/utils/ollamaExamples.js`)

9 working examples showing different use cases:

- Simple completion
- Schema generation
- Streaming responses
- Chat conversations
- Code help
- Component generation
- Status checks
- Code refactoring
- Test generation

### 3. DevTools Panel (`src/components/DevTools.jsx`)

A full-featured developer tools UI with 4 tabs:

- 📊 **Firestore Schema** - Generate database schemas from descriptions
- ⚛️ **React Component** - Generate components from descriptions
- 💡 **Code Help** - Analyze code and get answers
- 💬 **Custom Chat** - Free-form AI assistance with streaming

## Setup

### Prerequisites

You must have Ollama installed and running. If not:

```bash
# Install Ollama
brew install ollama

# Start Ollama as a service
brew services start ollama

# Pull DeepSeek Coder model (3.8GB)
ollama pull deepseek-coder:6.7b
```

### Verify Installation

```bash
# Check if Ollama is running
curl http://127.0.0.1:11434/api/version

# Expected response: {"version":"0.12.10"}
```

## Usage

### Basic Example

```javascript
import { generateCompletion } from "./utils/ollamaClient";

const response = await generateCompletion(
  "deepseek-coder:6.7b",
  "Write a function to validate email addresses"
);

console.log(response);
```

### Generate Firestore Schema

```javascript
import { generateFirestoreSchema } from "./utils/ollamaClient";

const schema = await generateFirestoreSchema(
  "User meditation progress with sessions, duration, and timestamps"
);

console.log(schema);
```

### Streaming Response

```javascript
import { generateStreamingCompletion } from "./utils/ollamaClient";

await generateStreamingCompletion(
  "deepseek-coder:6.7b",
  "Explain React hooks",
  (chunk) => {
    console.log(chunk); // Prints each chunk as it arrives
  }
);
```

### Use DevTools Panel

Add the DevTools component to your app:

```javascript
import DevTools from "./components/DevTools";

function App() {
  return (
    <div>
      {/* Your app content */}
      <DevTools />
    </div>
  );
}
```

Or add it to a route:

```javascript
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DevTools from "./components/DevTools";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dev-tools" element={<DevTools />} />
        {/* Other routes */}
      </Routes>
    </BrowserRouter>
  );
}
```

## Features

### ✅ Advantages

- **100% Local** - No API costs, no data leaves your machine
- **Fast** - Runs on your local hardware
- **Private** - Your code and prompts stay private
- **Offline** - Works without internet connection
- **Free** - No usage limits or API keys needed

### 🎯 Use Cases

- Generate Firestore schemas and data models
- Create React components from descriptions
- Debug and optimize existing code
- Generate test cases
- Refactor legacy code
- Get coding help and explanations
- Generate documentation

### 💻 Models

Currently configured for **DeepSeek Coder 6.7B**:

- Size: 3.8GB
- Speed: Fast on M1/M2 Macs
- Quality: Good for most coding tasks

You can also use other models:

```bash
# List available models
ollama list

# Pull other models
ollama pull codellama:7b
ollama pull deepseek-coder:33b  # Larger, better quality (16GB+ RAM needed)
```

## API Reference

### ollamaClient.js

#### generateCompletion(model, prompt, options)

Generate a non-streaming completion.

```javascript
const response = await generateCompletion(
  "deepseek-coder:6.7b",
  "Write a sorting algorithm",
  { temperature: 0.7 }
);
```

#### generateStreamingCompletion(model, prompt, onChunk, options)

Generate a streaming completion with real-time callbacks.

```javascript
await generateStreamingCompletion(
  "deepseek-coder:6.7b",
  "Explain async/await",
  (chunk) => console.log(chunk),
  { temperature: 0.5 }
);
```

#### chat(model, messages, options)

Chat with message history.

```javascript
const response = await chat("deepseek-coder:6.7b", [
  { role: "system", content: "You are a helpful coding assistant" },
  { role: "user", content: "How do I use useEffect?" },
]);
```

#### isOllamaRunning()

Check if Ollama server is available.

```javascript
const running = await isOllamaRunning();
console.log(running ? "Online" : "Offline");
```

#### listModels()

Get all installed models.

```javascript
const models = await listModels();
console.log(models.map((m) => m.name));
```

#### generateFirestoreSchema(description)

Generate a Firestore schema from a description.

```javascript
const schema = await generateFirestoreSchema(
  "Blog posts with title, content, author, tags, and timestamps"
);
```

#### getCodingHelp(code, question)

Get help with your code.

```javascript
const answer = await getCodingHelp(
  "const [data, setData] = useState([])",
  "How can I fetch data on mount?"
);
```

#### generateReactComponent(description)

Generate a React component.

```javascript
const component = await generateReactComponent(
  "A button with loading state and icon support"
);
```

## Troubleshooting

### Ollama Not Running

```bash
# Check status
brew services list | grep ollama

# Start service
brew services start ollama

# Check logs
brew services info ollama
```

### Model Not Found

```bash
# List installed models
ollama list

# Pull the model
ollama pull deepseek-coder:6.7b
```

### Slow Performance

- DeepSeek Coder 6.7B is optimized for speed
- For better quality (but slower), use the 33B model
- Close other heavy applications
- Check RAM usage (model needs ~4GB loaded)

### Connection Refused

Verify Ollama is running:

```bash
curl http://127.0.0.1:11434/api/tags
```

## Examples in Action

Run all examples:

```bash
# In your terminal
cd src/utils
node -e "require('./ollamaExamples').runAllExamples()"
```

Or uncomment the last line in `ollamaExamples.js`:

```javascript
// Uncomment this line:
runAllExamples();
```

Then import the file anywhere to run examples.

## Next Steps

1. **Try the DevTools Panel** - Access at `/dev-tools` route
2. **Run Examples** - Check `ollamaExamples.js` for usage patterns
3. **Integrate into Features** - Use in FloatingAIWidget, admin panels, etc.
4. **Experiment with Prompts** - Fine-tune prompts for your use cases
5. **Add Custom Functions** - Extend `ollamaClient.js` with your own helpers

## Resources

- [Ollama Documentation](https://ollama.ai/docs)
- [DeepSeek Coder Model](https://huggingface.co/deepseek-ai/deepseek-coder-6.7b-instruct)
- [Ollama API Reference](https://github.com/ollama/ollama/blob/main/docs/api.md)

---

**Need help?** Check `ollamaExamples.js` for working code samples, or ask questions in the Custom Chat tab of DevTools!
