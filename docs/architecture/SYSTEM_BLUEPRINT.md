# WellnessCafe AI — System Architecture Blueprint

## Core Layers
The system is composed of five primary layers:

1. **Client Layer (Vite + React + Tailwind)**
2. **AI Layer (OpenAI GPT-4o / Claude)**
3. **Agent Layer (Cloud Functions multi-agent system)**
4. **Memory Layer (Firestore user-specific learning)**
5. **Media Layer (Image/Video/Avatar generation)**

---

## 1. Client Layer (Vite + React)
### Responsibilities:
- Render sessions
- Host the tools (breathing, meditation, affirmations, trackers)
- Display dynamic avatars + animations
- Allow user interaction
- Provide frontend routing (React Router)
- Real-time Firestore sync
- User authentication flow
- Provider marketplace UI

### Key Components:
- `SessionOrchestrator.jsx`
- `StepRenderer.jsx`
- Step UIs (CheckIn, Breath, Meditation)
- Dashboard widgets
- AI-powered tool interfaces

---

## 2. AI Layer
The AI layer provides:
- Session generation
- Prompt interpretation
- JSON structured responses
- Behavioral analysis
- Suggestion generation
- Sentiment + mood analysis
- Provider recommendations

### Core Function:
