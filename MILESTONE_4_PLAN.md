# Milestone 4: Frontend AI Integration - Implementation Plan

## 🎯 Overview
Build the frontend interface for AI-powered session generation, allowing users to create personalized wellness sessions through conversation or templates.

## 📋 Previous Milestones Status
- ✅ **Milestone 1:** Foundation (SessionPlan types, StepRenderer, Basic StepUIs)
- ✅ **Milestone 2:** Session Orchestrator (SessionOrchestrator.jsx exists)
- 🚧 **Milestone 3:** AI Backend (OpenAI integration - needs review)
- 🎯 **Milestone 4:** Frontend AI Integration (Current)

## 🎨 Milestone 4 Components

### 1. Conversational Session Builder UI
**File:** `src/features/wellness-sessions/SessionBuilder.jsx`

**Features:**
- Chat-like interface for session creation
- Natural language input ("I need help with anxiety")
- AI responds with clarifying questions
- Generates session plan based on conversation
- Preview session before starting
- Edit/customize generated session

**User Flow:**
```
1. User enters intent ("I can't sleep")
2. AI asks clarifying questions
   - "How many minutes do you have?"
   - "What's your anxiety level?"
   - "Have you tried breathing exercises before?"
3. AI generates SessionPlan
4. User previews steps
5. User starts session OR customizes
```

### 2. Session History/Library
**File:** `src/features/wellness-sessions/SessionLibrary.jsx`

**Features:**
- Browse past sessions
- View session details and results
- "Repeat this session" button
- Filter by intent/date
- Session analytics (completion rate, mood improvement)
- Search sessions

**Data Display:**
```
┌─────────────────────────────────────┐
│ 📊 Your Session History             │
├─────────────────────────────────────┤
│ ✅ 10-Min Anxiety Reset             │
│    Nov 15 • calm_anxiety            │
│    Mood: 7→9 • 10 min               │
│    [Repeat] [Details]               │
├─────────────────────────────────────┤
│ ✅ Morning Grounding                │
│    Nov 14 • grounding               │
│    Mood: 5→8 • 15 min               │
│    [Repeat] [Details]               │
└─────────────────────────────────────┘
```

### 3. Template System
**File:** `src/features/wellness-sessions/SessionTemplates.jsx`

**Features:**
- Pre-built session templates
- Browse by intent/duration/difficulty
- Quick-start templates (no AI needed)
- Template cards with preview
- Customize template before starting

**Template Categories:**
- Quick Resets (5-10 min)
- Morning Rituals (10-20 min)
- Evening Wind-Down (15-30 min)
- Crisis Support (5-15 min)
- Deep Work (20-45 min)

## 🗂️ File Structure

```
src/features/wellness-sessions/
├── SessionBuilder.jsx           # NEW - Conversational UI
├── SessionLibrary.jsx           # NEW - History browser
├── SessionTemplates.jsx         # NEW - Template browser
├── SessionOrchestrator.jsx      # EXISTS - Session runner
├── components/
│   ├── ChatInterface.jsx        # NEW - Chat UI component
│   ├── SessionPreview.jsx       # NEW - Preview before start
│   ├── SessionCard.jsx          # NEW - Library card
│   └── TemplateCard.jsx         # NEW - Template card
└── steps/
    └── [existing step UIs]
```

## 🔌 API Integration Points

### 1. Generate Session (AI-powered)
```javascript
// POST /api/sessions/generate
{
  "userId": "user_123",
  "intent": "calm_anxiety",
  "context": {
    "availableMinutes": 10,
    "currentMood": 7,
    "preferences": ["breathing"]
  }
}

// Response: SessionPlan JSON
```

### 2. List Sessions (History)
```javascript
// GET /api/sessions?userId=user_123&limit=20
// Response: Array of SessionPlan objects
```

### 3. Get Templates
```javascript
// GET /api/sessions/templates
// Response: Array of template SessionPlans
```

## 🎨 UI/UX Design

### Session Builder Interface
```
┌────────────────────────────────────┐
│ 🤖 Let's Create Your Session      │
├────────────────────────────────────┤
│                                    │
│ AI: What brings you here today?    │
│                                    │
│ You: I'm feeling anxious and      │
│      can't relax                   │
│                                    │
│ AI: I understand. How much time   │
│     do you have? I can create a   │
│     5, 10, or 15-minute session.  │
│                                    │
│ You: [10 minutes]                 │
│                                    │
│ [Type your message...]            │
└────────────────────────────────────┘
```

### Session Preview
```
┌────────────────────────────────────┐
│ 10-Minute Anxiety Reset            │
├────────────────────────────────────┤
│ 📋 4 Steps • calm_anxiety          │
│                                    │
│ 1. ❓ Check-In (1 min)            │
│    Rate your anxiety level         │
│                                    │
│ 2. 🫁 Coherence Breathing (4 min) │
│    4-6 breathing pattern           │
│                                    │
│ 3. 🧘 Body Scan (4 min)           │
│    Progressive relaxation          │
│                                    │
│ 4. 📝 Reflection (1 min)          │
│    How do you feel now?            │
│                                    │
│ [Start Session] [Customize]        │
└────────────────────────────────────┘
```

## 🔄 Implementation Order

### Phase 1: Templates (No AI Required) ⭐ START HERE
1. Create SessionTemplates.jsx
2. Create TemplateCard component
3. Add hardcoded template data
4. Enable "Start from Template"
5. Test with existing SessionOrchestrator

### Phase 2: Session Library
1. Create SessionLibrary.jsx
2. Create SessionCard component
3. Fetch from Firestore
4. Display past sessions
5. Add "Repeat Session" functionality

### Phase 3: AI Session Builder
1. Create ChatInterface component
2. Create SessionBuilder.jsx
3. Connect to OpenAI API (from Milestone 3)
4. Add SessionPreview component
5. Enable session customization

## 📦 Dependencies Needed

```bash
# Already installed (check):
- framer-motion (for animations)
- lucide-react (for icons)

# May need to install:
- date-fns (for date formatting)
- react-markdown (for AI responses)
```

## 🧪 Testing Plan

### Template System
- [ ] Templates load and display correctly
- [ ] Template cards show all info
- [ ] "Start Template" launches SessionOrchestrator
- [ ] Templates render all step types

### Session Library
- [ ] Fetches user sessions from Firestore
- [ ] Displays session cards with metadata
- [ ] "Repeat" button creates new session
- [ ] Filter/search works correctly

### AI Builder
- [ ] Chat interface sends/receives messages
- [ ] AI generates valid SessionPlan JSON
- [ ] Preview shows all session steps
- [ ] Customization saves changes
- [ ] Generated sessions run in Orchestrator

## 🎯 Success Criteria

✅ Users can browse and start pre-built templates  
✅ Users can view past session history  
✅ Users can repeat previous sessions  
✅ Users can generate custom sessions via AI chat  
✅ All generated sessions validate correctly  
✅ Sessions integrate with existing Orchestrator  

## 📝 Notes

- Templates provide immediate value without AI
- Library builds on existing Firestore sessions
- AI Builder is the "wow" feature but most complex
- Keep UI consistent with LuxuryNavbar styling
- Use glassmorphism for chat interface

## 🚀 Next Steps

1. Review existing SessionOrchestrator
2. Create template data structure
3. Build TemplateCard component
4. Implement SessionTemplates page
5. Add route and navigation link

---

**Ready to start with Phase 1: Templates!**
