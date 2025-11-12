/**
 * Developer Tools Panel
 * Uses local Ollama AI to help with development tasks
 */

import React, { useState, useEffect } from "react";
import {
  isOllamaRunning,
  listModels,
  generateFirestoreSchema,
  getCodingHelp,
  generateReactComponent,
  generateStreamingCompletion,
} from "../utils/ollamaClient";
import "./DevTools.css";

const DevTools = () => {
  const [isOllamaActive, setIsOllamaActive] = useState(false);
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState("deepseek-coder:6.7b");
  const [activeTab, setActiveTab] = useState("schema"); // schema, component, help, chat
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Schema generator state
  const [schemaDescription, setSchemaDescription] = useState("");
  const [generatedSchema, setGeneratedSchema] = useState("");

  // Component generator state
  const [componentDescription, setComponentDescription] = useState("");
  const [generatedComponent, setGeneratedComponent] = useState("");

  // Code help state
  const [codeInput, setCodeInput] = useState("");
  const [questionInput, setQuestionInput] = useState("");
  const [helpAnswer, setHelpAnswer] = useState("");

  // Custom chat state
  const [customPrompt, setCustomPrompt] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    checkOllamaStatus();
  }, []);

  const checkOllamaStatus = async () => {
    try {
      const running = await isOllamaRunning();
      setIsOllamaActive(running);

      if (running) {
        const modelList = await listModels();
        setModels(modelList);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error checking Ollama:", err);
      setIsOllamaActive(false);
    }
  };

  const handleGenerateSchema = async () => {
    if (!schemaDescription.trim()) {
      setError("Please enter a schema description");
      return;
    }

    setLoading(true);
    setError("");
    setGeneratedSchema("");

    try {
      const schema = await generateFirestoreSchema(schemaDescription);
      setGeneratedSchema(schema);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateComponent = async () => {
    if (!componentDescription.trim()) {
      setError("Please enter a component description");
      return;
    }

    setLoading(true);
    setError("");
    setGeneratedComponent("");

    try {
      const component = await generateReactComponent(componentDescription);
      setGeneratedComponent(component);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGetCodingHelp = async () => {
    if (!codeInput.trim() || !questionInput.trim()) {
      setError("Please enter both code and question");
      return;
    }

    setLoading(true);
    setError("");
    setHelpAnswer("");

    try {
      const answer = await getCodingHelp(codeInput, questionInput);
      setHelpAnswer(answer);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomChat = async () => {
    if (!customPrompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    setLoading(true);
    setIsStreaming(true);
    setError("");
    setChatResponse("");

    try {
      let response = "";
      await generateStreamingCompletion(
        selectedModel,
        customPrompt,
        (chunk) => {
          response += chunk;
          setChatResponse(response);
        }
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setIsStreaming(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };

  if (!isOllamaActive) {
    return (
      <div className="dev-tools">
        <div className="dev-tools-error">
          <h2>⚠️ Ollama Not Running</h2>
          <p>Please start Ollama to use developer tools:</p>
          <code>brew services start ollama</code>
          <button onClick={checkOllamaStatus}>Retry Connection</button>
        </div>
      </div>
    );
  }

  return (
    <div className="dev-tools">
      <div className="dev-tools-header">
        <h1>🛠️ Developer Tools</h1>
        <div className="model-selector">
          <label>Model:</label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            {models.map((model) => (
              <option key={model.name} value={model.name}>
                {model.name}
              </option>
            ))}
          </select>
          <span className="status-indicator">● Online</span>
        </div>
      </div>

      <div className="dev-tools-tabs">
        <button
          className={activeTab === "schema" ? "active" : ""}
          onClick={() => setActiveTab("schema")}
        >
          📊 Firestore Schema
        </button>
        <button
          className={activeTab === "component" ? "active" : ""}
          onClick={() => setActiveTab("component")}
        >
          ⚛️ React Component
        </button>
        <button
          className={activeTab === "help" ? "active" : ""}
          onClick={() => setActiveTab("help")}
        >
          💡 Code Help
        </button>
        <button
          className={activeTab === "chat" ? "active" : ""}
          onClick={() => setActiveTab("chat")}
        >
          💬 Custom Chat
        </button>
      </div>

      {error && <div className="dev-tools-error-msg">{error}</div>}

      <div className="dev-tools-content">
        {/* Schema Generator Tab */}
        {activeTab === "schema" && (
          <div className="tool-panel">
            <h2>Generate Firestore Schema</h2>
            <textarea
              placeholder="Describe your schema (e.g., 'User meditation progress with sessions, timestamps, and mood ratings')"
              value={schemaDescription}
              onChange={(e) => setSchemaDescription(e.target.value)}
              rows={4}
            />
            <button onClick={handleGenerateSchema} disabled={loading}>
              {loading ? "Generating..." : "Generate Schema"}
            </button>

            {generatedSchema && (
              <div className="output-panel">
                <div className="output-header">
                  <h3>Generated Schema</h3>
                  <button onClick={() => copyToClipboard(generatedSchema)}>
                    📋 Copy
                  </button>
                </div>
                <pre>{generatedSchema}</pre>
              </div>
            )}
          </div>
        )}

        {/* Component Generator Tab */}
        {activeTab === "component" && (
          <div className="tool-panel">
            <h2>Generate React Component</h2>
            <textarea
              placeholder="Describe your component (e.g., 'A card that displays meditation statistics with progress bars')"
              value={componentDescription}
              onChange={(e) => setComponentDescription(e.target.value)}
              rows={4}
            />
            <button onClick={handleGenerateComponent} disabled={loading}>
              {loading ? "Generating..." : "Generate Component"}
            </button>

            {generatedComponent && (
              <div className="output-panel">
                <div className="output-header">
                  <h3>Generated Component</h3>
                  <button onClick={() => copyToClipboard(generatedComponent)}>
                    📋 Copy
                  </button>
                </div>
                <pre>{generatedComponent}</pre>
              </div>
            )}
          </div>
        )}

        {/* Code Help Tab */}
        {activeTab === "help" && (
          <div className="tool-panel">
            <h2>Get Coding Help</h2>
            <textarea
              placeholder="Paste your code here..."
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              rows={6}
            />
            <textarea
              placeholder="Ask a question about the code (e.g., 'Is there a memory leak? How can I optimize this?')"
              value={questionInput}
              onChange={(e) => setQuestionInput(e.target.value)}
              rows={2}
            />
            <button onClick={handleGetCodingHelp} disabled={loading}>
              {loading ? "Analyzing..." : "Get Help"}
            </button>

            {helpAnswer && (
              <div className="output-panel">
                <div className="output-header">
                  <h3>Answer</h3>
                  <button onClick={() => copyToClipboard(helpAnswer)}>
                    📋 Copy
                  </button>
                </div>
                <pre>{helpAnswer}</pre>
              </div>
            )}
          </div>
        )}

        {/* Custom Chat Tab */}
        {activeTab === "chat" && (
          <div className="tool-panel">
            <h2>Custom AI Chat</h2>
            <textarea
              placeholder="Enter any prompt for the AI model..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              rows={4}
            />
            <button onClick={handleCustomChat} disabled={loading}>
              {loading ? "Streaming..." : "Send"}
            </button>

            {chatResponse && (
              <div className="output-panel">
                <div className="output-header">
                  <h3>Response {isStreaming && "(streaming...)"}</h3>
                  <button onClick={() => copyToClipboard(chatResponse)}>
                    📋 Copy
                  </button>
                </div>
                <pre>{chatResponse}</pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DevTools;
