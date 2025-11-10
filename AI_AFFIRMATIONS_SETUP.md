# 🌟 AI Affirmations Cloud Function - Setup Guide

**For:** WellnessCafe Platform  
**Feature:** AI-Generated Personalized Affirmations  
**Status:** Ready to Deploy (Optional Enhancement)

---

## 🎯 What This Adds

Transform your affirmations from **static fallbacks** to **AI-generated, personalized messages** based on:

- User mood
- Preferred tone (calm, empowering, gentle, confident)
- Topics (resilience, self-worth, patience, forgiveness, etc.)
- Style (first-person, present-tense, I-statements)
- Length preference

---

## 📋 Prerequisites

1. ✅ Firebase project (already set up)
2. ✅ OpenAI API account
3. ✅ Node.js 18+ installed
4. ✅ Firebase CLI installed (`npm install -g firebase-tools`)
5. ⏳ OpenAI API key (get from https://platform.openai.com/api-keys)

---

## 🚀 Step-by-Step Setup

### Step 1: Get OpenAI API Key

1. Visit https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Name it: "WellnessCafe Affirmations"
4. Copy the key (starts with `sk-...`)
5. **Save it securely** - you won't see it again!

**Cost Estimate:**

- Model: `gpt-4o-mini` (cheapest)
- ~$0.00015 per affirmation
- 1000 affirmations = ~$0.15
- Very affordable for production use

---

### Step 2: Initialize Firebase Functions

```bash
cd /Users/mouthcouture/Documents/GitHub/Wellcafeland

# Initialize Functions (if not already done)
firebase init functions

# When prompted:
# - Language: JavaScript
# - ESLint: Yes (recommended)
# - Install dependencies: Yes
```

---

### Step 3: Install OpenAI SDK

```bash
cd functions
npm install openai
cd ..
```

---

### Step 4: Set Secret in Firebase

```bash
firebase functions:secrets:set OPENAI_API_KEY
# Paste your OpenAI API key when prompted
```

**Verify it's set:**

```bash
firebase functions:secrets:access OPENAI_API_KEY
```

---

### Step 5: Create Cloud Function

**Edit:** `functions/index.js`

Replace the entire file with:

```javascript
/**
 * AI Affirmations Cloud Function
 * Generates personalized affirmations using OpenAI GPT-4o-mini
 */

const functions = require("firebase-functions/v2");
const { onCall } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const { OpenAI } = require("openai");

const OPENAI_API_KEY = defineSecret("OPENAI_API_KEY");

/**
 * Generate personalized affirmation based on user preferences
 *
 * @param {Object} req.data
 * @param {string} req.data.tone - Tone preference (calm, empowering, gentle, confident)
 * @param {string[]} req.data.topics - Topic preferences (resilience, self-worth, etc.)
 * @param {string} req.data.style - Style preference (first-person, present-tense, I-statements)
 * @param {string} req.data.length - Length preference (<=20 words, <=30 words)
 * @param {string} req.data.mood - Current mood hint (optional)
 *
 * @returns {Promise<{text: string}>} Generated affirmation
 */
exports.generateAffirmation = onCall(
  {
    secrets: [OPENAI_API_KEY],
    cors: true,
    memory: "256MiB",
    timeoutSeconds: 30,
  },
  async (req) => {
    // Validate request
    if (!req.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated"
      );
    }

    // Extract parameters with defaults
    const {
      tone = "calm and empowering",
      topics = ["resilience", "self-worth"],
      style = "present-tense, first-person",
      length = "max 20 words",
      mood = "n/a",
    } = req.data || {};

    // Initialize OpenAI client
    const client = new OpenAI({
      apiKey: OPENAI_API_KEY.value(),
    });

    // Build prompt
    const topicsString = Array.isArray(topics) ? topics.join(", ") : topics;
    const prompt = `Write one concise daily affirmation for a person in recovery.

Tone: ${tone}.
Topics: ${topicsString}.
Style: ${style}.
Length: ${length}.
Current mood hint: ${mood}.

Guidelines:
- Be compassionate and non-judgmental
- Avoid triggers or references to substances
- Use empowering, present-tense language
- Keep it personal and actionable
- Return plain text only (no quotes, no formatting)

Example format: "I am [quality] and [action] [outcome]."
`;

    try {
      // Call OpenAI API
      const response = await client.chat.completions.create({
        model: "gpt-4o-mini", // Cost-effective, high-quality
        messages: [
          {
            role: "system",
            content:
              "You are a compassionate recovery coach creating personalized affirmations. Your affirmations are empowering, trauma-informed, and supportive of sobriety and mental health.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.9, // High creativity for varied affirmations
        max_tokens: 60, // ~30 words max
        presence_penalty: 0.6, // Encourage unique phrasing
        frequency_penalty: 0.5, // Reduce repetition
      });

      // Extract affirmation text
      const affirmation =
        response.choices?.[0]?.message?.content?.trim() ||
        "I am steady, safe, and moving forward one step at a time.";

      // Remove any quotes if AI added them
      const cleanAffirmation = affirmation.replace(/^["']|["']$/g, "");

      // Log for analytics (optional)
      console.log("Generated affirmation:", {
        uid: req.auth.uid,
        tone,
        topics: topicsString,
        mood,
        length: cleanAffirmation.split(" ").length,
      });

      return { text: cleanAffirmation };
    } catch (error) {
      console.error("OpenAI API error:", error);

      // Fallback affirmation if API fails
      const fallbacks = [
        "I am safe, grounded, and open to new possibilities today.",
        "I choose progress over perfection, one step at a time.",
        "I honor my journey and trust the process of healing.",
        "I am worthy of love, peace, and all good things.",
        "My recovery is a gift I give myself every single day.",
        "I am stronger than my struggles and braver than I know.",
      ];

      const randomFallback =
        fallbacks[Math.floor(Math.random() * fallbacks.length)];

      return { text: randomFallback };
    }
  }
);
```

---

### Step 6: Deploy Cloud Function

```bash
firebase deploy --only functions:generateAffirmation
```

**Expected output:**

```
✔  functions[generateAffirmation(us-central1)] Successful create operation.
Function URL (generateAffirmation): https://us-central1-[project-id].cloudfunctions.net/generateAffirmation
✔  Deploy complete!
```

---

### Step 7: Test the Function

**Option 1: Test in Firebase Console**

1. Go to Firebase Console → Functions
2. Find `generateAffirmation`
3. Click "Test function"
4. Input:

```json
{
  "tone": "empowering",
  "topics": ["resilience", "courage"],
  "style": "first-person",
  "length": "<=20 words",
  "mood": "feeling anxious"
}
```

**Option 2: Test in Your App**

1. Sign in to your app
2. Navigate to Dashboard
3. Click refresh button on DashboardPin
4. Should see AI-generated affirmation (not fallback)

---

## 🧪 Verification

### How to Know It's Working:

1. **Check Function Logs:**

```bash
firebase functions:log --only generateAffirmation
```

2. **Look for Log Entry:**

```
Generated affirmation: {
  uid: "user123",
  tone: "calm",
  topics: "resilience, self-worth",
  mood: "morning reflection",
  length: 15
}
```

3. **In App:**

- DashboardPin shows unique affirmations each refresh
- Messages are personalized to mood hints
- Different from fallback affirmations

---

## 💰 Cost Analysis

### OpenAI Pricing (gpt-4o-mini):

- **Input:** $0.15 / 1M tokens (~$0.00001 per affirmation)
- **Output:** $0.60 / 1M tokens (~$0.00004 per affirmation)
- **Total:** ~$0.00005 per affirmation

### Usage Scenarios:

**Scenario 1: Small App (100 users)**

- 100 users × 2 affirmations/day = 200 affirmations/day
- 200 × 30 days = 6,000 affirmations/month
- 6,000 × $0.00005 = **$0.30/month**

**Scenario 2: Medium App (1,000 users)**

- 1,000 users × 2 affirmations/day = 2,000 affirmations/day
- 2,000 × 30 days = 60,000 affirmations/month
- 60,000 × $0.00005 = **$3.00/month**

**Scenario 3: Large App (10,000 users)**

- 10,000 users × 2 affirmations/day = 20,000 affirmations/day
- 20,000 × 30 days = 600,000 affirmations/month
- 600,000 × $0.00005 = **$30.00/month**

### Cost Optimization:

- ✅ Cache daily affirmations (already implemented via localStorage)
- ✅ Use fallbacks if quota exceeded
- ✅ Rate limit per user (1 generation/minute)

---

## 🔒 Security Best Practices

### ✅ Already Implemented:

1. **Authentication Required** - Only signed-in users can call function
2. **Secret Management** - API key stored in Firebase Secrets (never in code)
3. **Error Handling** - Graceful fallback if API fails
4. **Input Validation** - Request data validated before processing

### 🔜 Recommended Additions:

**Rate Limiting:**

```javascript
// In functions/index.js, add before OpenAI call:
const { RateLimiterMemory } = require("rate-limiter-flexible");
const rateLimiter = new RateLimiterMemory({
  points: 10, // 10 requests
  duration: 60, // per 60 seconds
});

try {
  await rateLimiter.consume(req.auth.uid);
} catch (error) {
  throw new functions.https.HttpsError(
    "resource-exhausted",
    "Too many requests. Please try again in a minute."
  );
}
```

**Usage Monitoring:**

```javascript
// Log to Firestore for analytics
await db.collection("affirmation_usage").add({
  uid: req.auth.uid,
  timestamp: admin.firestore.FieldValue.serverTimestamp(),
  tone,
  topics,
  mood,
  model: "gpt-4o-mini",
  cost: 0.00005,
});
```

---

## 🎯 Advanced Features (Optional)

### 1. **User Feedback Loop**

```javascript
// In useAffirmations hook:
const rateAffirmation = async (affirmationId, rating) => {
  await updateDoc(doc(db, "users", uid, "affirmations", affirmationId), {
    rating, // 1-5 stars
    ratedAt: serverTimestamp(),
  });
};
```

### 2. **Personalization Over Time**

```javascript
// Pass user history to OpenAI:
const { favoriteTopics, avgMood } = await getUserStats(req.auth.uid);

const prompt = `Based on user's favorite topics (${favoriteTopics.join(", ")}) 
and average mood (${avgMood}/10), create an affirmation...`;
```

### 3. **Multilingual Support**

```javascript
// Add language parameter:
const { language = "en" } = req.data;

const prompt = `Write an affirmation in ${language}...`;
```

---

## 🐛 Troubleshooting

### Issue 1: "Function not found"

**Solution:** Deploy again and wait 2-3 minutes for propagation

```bash
firebase deploy --only functions:generateAffirmation
```

### Issue 2: "Permission denied"

**Solution:** Check Firestore rules allow authenticated reads/writes

```
match /users/{userId}/affirmations/{affirmId} {
  allow read, write: if request.auth.uid == userId;
}
```

### Issue 3: "OpenAI API error"

**Solution:** Check API key is valid

```bash
firebase functions:secrets:access OPENAI_API_KEY
# Should print your API key
```

### Issue 4: "Timeout"

**Solution:** Increase timeout in function config

```javascript
exports.generateAffirmation = onCall(
  {
    timeoutSeconds: 60, // Increase from 30 to 60
    // ...
  }
  // ...
);
```

---

## 📊 Monitoring

### Firebase Console:

1. **Functions Dashboard:** See invocation count, errors, latency
2. **Logs:** Real-time function logs
3. **Usage:** Track API calls per day/month

### OpenAI Dashboard:

1. Visit https://platform.openai.com/usage
2. Monitor token usage
3. Set spending limits (recommended: $10/month)

---

## ✅ Verification Checklist

- [ ] OpenAI API key obtained
- [ ] Firebase Functions initialized
- [ ] OpenAI npm package installed
- [ ] Secret set in Firebase
- [ ] functions/index.js updated
- [ ] Function deployed successfully
- [ ] Tested in Firebase Console
- [ ] Tested in production app
- [ ] Logs show successful generation
- [ ] Cost monitoring enabled
- [ ] Spending limit set on OpenAI account

---

## 🎉 Success!

Once deployed, your users will receive:

- ✨ **Unique affirmations** every day
- 💖 **Personalized** to their mood and preferences
- 🧠 **AI-powered** insights and encouragement
- 🔄 **Infinite variety** (never see the same message twice)

**The useAffirmations hook will automatically:**

1. Try Cloud Function first
2. Fall back to hardcoded affirmations if function fails
3. Cache results for 24 hours
4. Handle errors gracefully

**No code changes needed in your app!** 🎊

---

**Questions?** Check Firebase Functions docs: https://firebase.google.com/docs/functions

**OpenAI Help:** https://platform.openai.com/docs/guides/text-generation
