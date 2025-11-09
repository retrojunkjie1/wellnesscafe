# 🛠️ How to Use DevTools - Quick Start Guide

## 🚀 Accessing DevTools

### Prerequisites

1. **Admin Account Required** - You must be logged in as an admin
2. **Email Verified** - Your email must be verified
3. **Ollama Running** - Local AI server must be active

### Access URL

```
https://wellnesscafelanding.web.app/dev-tools
```

Or locally:

```
http://localhost:3000/dev-tools
```

---

## 📋 Tab Overview

### 1. 📊 Firestore Schema Generator

**Use Case**: Generate database schemas for Firestore

**How to Use**:

1. Click the "Firestore Schema" tab
2. Enter a description like:
   ```
   User meditation progress with sessions, duration, timestamps, and mood ratings
   ```
3. Click "Generate Schema"
4. Wait 5-10 seconds for AI response
5. Click "Copy" to copy the schema
6. Paste into your Firestore setup

**Example Output**:

```javascript
const meditationSchema = {
  users: {
    userId: "string",
    email: "string",
    createdAt: "timestamp",
    totalSessions: "number",
  },
  sessions: {
    sessionId: "string",
    userId: "string",
    duration: "number",
    timestamp: "timestamp",
    moodRating: "number",
  },
};
```

---

### 2. ⚛️ React Component Generator

**Use Case**: Generate React components from descriptions

**How to Use**:

1. Click the "React Component" tab
2. Describe your component:
   ```
   A meditation timer card with start/pause buttons, duration display, and ambient sound selector
   ```
3. Click "Generate Component"
4. AI generates complete React code
5. Click "Copy" and paste into your project

**Example Output**:

```javascript
import React, { useState } from "react";

const MeditationCard = () => {
  const [isActive, setIsActive] = useState(false);
  // ... component code
};

export default MeditationCard;
```

---

### 3. 💡 Code Help Assistant

**Use Case**: Get help with existing code

**How to Use**:

1. Click the "Code Help" tab
2. Paste your code in the first box:
   ```javascript
   const [data, setData] = useState([]);
   useEffect(() => {
     fetchData().then(setData);
   }, []);
   ```
3. Ask a question in the second box:
   ```
   Is there a memory leak in this code? How can I fix it?
   ```
4. Click "Get Help"
5. AI analyzes and provides detailed answer

**Example Response**:

```
Yes, there is a potential memory leak. The useEffect doesn't
clean up the promise if the component unmounts. Here's the fix:

useEffect(() => {
  let isMounted = true;
  fetchData().then(result => {
    if (isMounted) setData(result);
  });
  return () => { isMounted = false; };
}, []);
```

---

### 4. 💬 Custom AI Chat

**Use Case**: Free-form AI assistance with streaming

**How to Use**:

1. Click the "Custom Chat" tab
2. Enter any prompt:
   ```
   Explain the differences between useState and useReducer in React,
   and when to use each one
   ```
3. Click "Send"
4. Watch AI response stream in real-time
5. Click "Copy" to save the response

**Best For**:

- Code explanations
- Best practices
- Algorithm help
- Documentation generation
- Debugging strategies

---

## 🎯 Pro Tips

### ✅ Do's

- **Be Specific**: More detail = better results
- **Test Small**: Generate small components first
- **Iterate**: Refine prompts if results aren't perfect
- **Copy Fast**: Copy results before generating new ones
- **Use Examples**: Include example data in prompts

### ❌ Don'ts

- **Don't Rush**: Wait for full response (5-15 seconds)
- **Don't Overload**: Keep prompts under 500 words
- **Don't Expect Perfect**: AI may need refinement
- **Don't Share Secrets**: Avoid pasting sensitive code/keys

---

## 📊 Response Times

| Task Type       | Expected Time |
| --------------- | ------------- |
| Simple Schema   | 5-10 seconds  |
| React Component | 10-20 seconds |
| Code Help       | 5-15 seconds  |
| Custom Chat     | 10-30 seconds |

_Times vary based on prompt complexity and model load_

---

## 🔧 Troubleshooting

### "Ollama Not Running" Error

**Solution**:

```bash
brew services start ollama
```

Then refresh the page.

---

### Slow Responses

**Causes**:

- First request after idle (model loading)
- Complex prompts
- System resources low

**Solutions**:

- Wait for first request to complete
- Simplify your prompt
- Close other heavy applications

---

### Empty or Incorrect Responses

**Solutions**:

1. **Be More Specific**: Add more context to your prompt
2. **Try Again**: Click generate again (AI is non-deterministic)
3. **Rephrase**: Use different wording
4. **Check Model**: Run `ollama list` to verify model is installed

---

## 🎨 Example Prompts

### Schema Generation

```
Blog platform with posts, comments, likes, users, and categories
```

```
E-commerce store with products, orders, reviews, and inventory tracking
```

```
Task management app with projects, tasks, subtasks, and team members
```

---

### Component Generation

```
A loading spinner component with customizable color, size, and animation speed
```

```
A searchable dropdown with multi-select, clear all, and custom styling
```

```
An image gallery with lightbox, thumbnails, and keyboard navigation
```

---

### Code Help

```
[Paste code]
Question: How can I optimize this for better performance?
```

```
[Paste code]
Question: What's the best way to add error handling here?
```

```
[Paste code]
Question: Can you convert this to TypeScript with proper types?
```

---

## 📚 Model Information

**Current Model**: DeepSeek Coder 6.7B

**Strengths**:

- ✅ JavaScript/React expertise
- ✅ Fast response times
- ✅ Good code quality
- ✅ Database schema design
- ✅ Bug detection

**Limitations**:

- ⚠️ May suggest outdated patterns occasionally
- ⚠️ Complex algorithms may need refinement
- ⚠️ Not aware of your specific codebase context

---

## 🆘 Need More Help?

1. **Read Full Docs**: Check `OLLAMA_INTEGRATION.md`
2. **See Examples**: Open `src/utils/ollamaExamples.js`
3. **Test Locally**: Run `node test-ollama.js`
4. **Check API**: Review `src/utils/ollamaClient.js`

---

## 🎉 Success Stories

### Generated in Seconds

- ✅ Firestore schema for meditation tracking
- ✅ React component for breathing timer
- ✅ Code review for useEffect memory leak
- ✅ Test cases for helper functions
- ✅ Documentation for API endpoints

---

**Happy Coding! 🚀**

_Last Updated: November 9, 2025_
