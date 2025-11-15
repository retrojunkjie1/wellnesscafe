# SessionPlan Blueprint - Implementation Documentation

## 🎯 Overview

The SessionPlan Blueprint is the "language" for building dynamic, AI-driven wellness sessions on WellnessCafe. This system allows AI to compose structured, multi-step wellness experiences by combining existing tools (breathing, meditation, journaling, etc.) into cohesive therapeutic sessions.

**Status:** ✅ Milestone 1 Complete (Foundation)

---

## 📁 File Structure

```
src/
├── domain/
│   └── sessionPlan.js                     # Core type definitions & validation
│
└── features/
    └── wellness-sessions/
        └── steps/
            ├── StepRenderer.jsx           # Routes steps to UI components
            ├── CheckInStepUI.jsx          # Check-in questions wrapper
            ├── BreathStepUI.jsx           # Breathing exercise wrapper
            └── MeditationStepUI.jsx       # Meditation guide wrapper
```

---

## 🧩 Core Components

### 1. Domain Layer (`src/domain/sessionPlan.js`)

**Purpose:** Single source of truth for session structure

**Key Exports:**
- **Type Definitions:** JSDoc types for all session components
- **Metadata Objects:**
  - `INTENT_METADATA` - 8 session intents (sleep_reset, calm_anxiety, etc.)
  - `STEP_KIND_METADATA` - 9 step types with icons and colors
- **Utility Functions:**
  - `validateSessionPlan()` - Basic schema validation
  - `generateSessionId()` - Create unique session IDs
  - `calculateTotalMinutes()` - Sum step durations

**Session Intents:**
```javascript
- sleep_reset      // Wind down for sleep
- calm_anxiety     // Regulate nervous system
- craving_wave     // Ride urges without acting
- grounding        // Present moment awareness
- morning_reset    // Start day with intention
- evening_winddown // Transition to rest
- body_awareness   // Connect with physical sensations
- custom           // Tailored to specific needs
```

**Step Types:**
```javascript
- check_in             // Collect user state
- breath               // Breathwork exercise
- yoga                 // Movement/poses
- meditation           // Guided meditation
- journaling           // Reflective writing
- education            // Psychoeducation
- reflection           // Simple questions
- media                // AI-generated content
- provider_suggestion  // Recommend support
```

---

### 2. Step Renderer (`StepRenderer.jsx`)

**Purpose:** Router that maps step types to UI components

**How it works:**
1. Receives a `SessionStep` object
2. Checks `step.kind` property
3. Routes to appropriate UI component
4. Passes callbacks (`onComplete`, `onSkip`)

**Current Status:**
- ✅ CheckInStepUI implemented
- ✅ BreathStepUI implemented  
- ✅ MeditationStepUI implemented
- 🚧 6 step types show placeholder (coming in Milestone 5)

---

### 3. Step UI Components

#### CheckInStepUI
- **Purpose:** Collect user responses to questions
- **Features:**
  - Multi-question flow with progress indicator
  - Scale inputs (1-10 slider)
  - Text inputs (textarea)
  - Multi-select (placeholder for Phase 2)
  - Response summary display

#### BreathStepUI
- **Purpose:** Guide breathing exercises
- **Features:**
  - Animated breathing orb
  - Configurable patterns (inhale/exhale/hold)
  - Cycle counter and timer
  - Pause/resume controls
  - Pattern info display
  - Auto-completion when target reached

#### MeditationStepUI
- **Purpose:** Display meditation script + timer
- **Features:**
  - Collapsible script display
  - Style-specific colors/emojis
  - Pulsing visual timer
  - Pause/resume functionality
  - Progress tracking
  - Meditation tips

---

## 📊 Data Flow Example

```
1. AI generates SessionPlan JSON
   ↓
2. Frontend validates with validateSessionPlan()
   ↓
3. Session page maps over steps array
   ↓
4. StepRenderer routes each step to UI
   ↓
5. Each StepUI calls onComplete() with data
   ↓
6. Session orchestrator advances to next step
   ↓
7. Final step -> save session metrics to Firestore
```

---

## 💾 Example SessionPlan

```javascript
{
  "id": "session_2025_11_15_001",
  "userId": "user_123",
  "intent": "calm_anxiety",
  "title": "10-Minute Nervous System Reset",
  "aiSummary": "Check in, regulate breath, gently move, then journal.",
  "totalMinutes": 10,
  "createdAtIso": "2025-11-15T18:30:00.000Z",
  
  "steps": [
    {
      "id": "step_1",
      "kind": "check_in",
      "order": 1,
      "title": "Quick Check-In",
      "questions": [
        {
          "id": "q_mood",
          "label": "How anxious do you feel right now?",
          "type": "scale",
          "scaleMin": 0,
          "scaleMax": 10
        }
      ]
    },
    {
      "id": "step_2",
      "kind": "breath",
      "order": 2,
      "title": "Coherence Breathing",
      "durationSec": 180,
      "pattern": { "inhale": 4, "exhale": 6 },
      "style": "coherence",
      "coaching": "Breathe into your belly, lengthen each exhale."
    },
    {
      "id": "step_3",
      "kind": "meditation",
      "order": 3,
      "title": "Body Scan",
      "durationSec": 300,
      "style": "body_scan",
      "script": "Bring attention to your feet. Notice any sensations..."
    }
  ],
  
  "followUpSuggestions": [
    "Try a longer 20-minute version tomorrow evening.",
    "Add gentle yoga if still feeling restless."
  ]
}
```

---

## 🎨 Design Patterns

### Wrapper Pattern
**Why:** Preserve existing tools while enabling session context

**How it works:**
```jsx
// Original tool: standalone component
<AuroraBreathing />

// Session wrapper: takes SessionPlan data
<BreathStepUI 
  step={breathStepData}
  onComplete={(data) => advanceToNextStep(data)}
/>
```

**Benefits:**
- Existing tools work independently
- Session versions are lightweight
- Consistent API across all step types

### Prop Drilling vs Context
**Current:** Props (`onComplete`, `onSkip`)  
**Future:** Consider SessionContext for deeper nesting

---

## 🚀 Next Steps (Milestone 2)

### Build Session Orchestrator

**File:** `src/features/wellness-sessions/SessionOrchestrator.jsx`

**Features needed:**
- Session state management (current step, completion data)
- Step navigation (next/back/skip)
- Progress indicator
- Session summary on completion
- Save to Firestore

**Pseudocode:**
```jsx
function SessionOrchestrator({ sessionPlan }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepData, setStepData] = useState([]);
  
  const currentStep = sessionPlan.steps[currentStepIndex];
  
  const handleStepComplete = (data) => {
    setStepData([...stepData, data]);
    if (currentStepIndex < sessionPlan.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      saveSessionToFirestore();
      showCompletionSummary();
    }
  };
  
  return (
    <div>
      <ProgressBar current={currentStepIndex + 1} total={steps.length} />
      <StepRenderer 
        step={currentStep}
        onComplete={handleStepComplete}
      />
    </div>
  );
}
```

---

## 🔮 Future Milestones

### Milestone 3: AI Backend
- OpenAI GPT-4 integration
- Structured JSON output
- Session generation Cloud Function
- Prompt templates with examples

### Milestone 4: Frontend AI Integration
- Conversational session builder UI
- Session history/library
- Template system

### Milestone 5: Advanced Steps
- Yoga/movement step UI
- Journaling step (wrap TriggerJournal)
- Education content display
- Provider suggestions

### Milestone 6: Premium Features
- Session analytics
- Mood trending
- Custom session creation
- Session sharing

---

## 🛠️ Integration Points

### Existing Tools → Session Steps
| Existing Tool | Session Step | Status |
|--------------|--------------|--------|
| MoodCheckIn | CheckInStepUI | ✅ Wrapped |
| AuroraBreathing | BreathStepUI | ✅ Simplified |
| MeditationTimer | MeditationStepUI | ✅ Wrapped |
| TriggerJournal | JournalingStepUI | 🚧 Milestone 5 |
| --- | YogaStepUI | 🚧 Milestone 5 |
| --- | EducationStepUI | 🚧 Milestone 5 |

### Firestore Collections
```
users/{userId}/
├── sessions/{sessionId}          # Individual sessions
│   ├── status: "planned" | "active" | "completed"
│   ├── steps: SessionStep[]
│   ├── metrics: { moodBefore, moodAfter }
│   └── completedAt: Timestamp
│
└── sessionHistory/{date}          # Daily rollups
    ├── sessionCount
    └── totalMinutes
```

---

## 📖 Developer Guide

### Creating a New Step Type

1. **Add type to `sessionPlan.js`:**
```javascript
/**
 * @typedef {Object} CustomStep
 * @property {string} id
 * @property {"custom"} kind
 * @property {string} title
 * @property {number} order
 * // ... custom properties
 */
```

2. **Add metadata:**
```javascript
export const STEP_KIND_METADATA = {
  // ...
  custom: { label: "Custom", icon: "✨", color: "#6366f1" },
};
```

3. **Create UI component:**
```jsx
// src/features/wellness-sessions/steps/CustomStepUI.jsx
const CustomStepUI = ({ step, onComplete, onSkip, metadata }) => {
  return (
    <div>
      {/* Your UI here */}
      <button onClick={() => onComplete({ customData: {...} })}>
        Complete
      </button>
    </div>
  );
};
```

4. **Register in StepRenderer:**
```jsx
case "custom":
  return <CustomStepUI {...commonProps} />;
```

### Validation
```javascript
import { validateSessionPlan } from '../domain/sessionPlan';

const { valid, errors } = validateSessionPlan(plan);
if (!valid) {
  console.error('Invalid session plan:', errors);
}
```

---

## 🧪 Testing Strategy

### Unit Tests (Recommended)
- `sessionPlan.js` validation functions
- Step component rendering
- Timer/counter logic

### Integration Tests
- Session orchestrator flow
- Firestore save/load
- Step data passing

### E2E Tests
- Complete session flow
- Step navigation
- Data persistence

---

## 📝 Notes

- **Why JavaScript over TypeScript?** Consistency with existing codebase while maintaining type safety via JSDoc
- **Framer Motion dependency** Used for smooth animations in BreathStepUI
- **Lucide React icons** Consistent icon library across step UIs
- **Tailwind CSS** All components use existing design system

---

## 🎉 Milestone 1 Complete!

**What was built:**
✅ Complete type system for sessions  
✅ Validation utilities  
✅ Step routing infrastructure  
✅ 3 fully functional step UI components  
✅ Extensible architecture for future steps  

**What's functional:**
- CheckIn steps with scale/text inputs
- Breathing exercises with animated orb
- Meditation timer with script display
- Clean component API with onComplete callbacks

**Ready for Milestone 2:** Session Orchestrator UI

---

**Last Updated:** November 15, 2025  
**Version:** 1.0.0 (Foundation)
