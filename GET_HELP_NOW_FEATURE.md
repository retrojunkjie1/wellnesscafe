# Get Help Now - Smart Crisis Support Feature

## 🚀 Feature Overview
A comprehensive crisis support system that intelligently connects users to AI-powered help or emergency resources, accessible throughout the site with special emphasis on mobile users and crisis situations.

## ✨ Key Features

### 1. Smart AI Integration
- **Context-Aware Prompts**: Automatically sends appropriate help requests based on user context (crisis, recovery, or general)
- **Seamless Widget Control**: Opens FloatingAIWidget with pre-filled prompts via forwardRef architecture
- **Crisis Priority Responses**: AI recognizes crisis keywords and immediately provides 988 hotline information

### 2. Emergency Resources Fallback
When AI is unavailable or as a backup option, displays comprehensive crisis resources:
- **988 Suicide & Crisis Lifeline**: 24/7 call or text support
- **SAMHSA National Helpline**: 1-800-662-HELP for substance use support
- **Crisis Text Line**: Text HOME to 741741 for immediate text counseling

### 3. Multi-Variant Button System
Four distinct button styles for flexible placement:

#### Mobile Variant (`variant="mobile"`)
- Full-width design optimized for mobile menus
- Prominent crisis-red styling with pulse animation
- Large tap targets (1.25rem padding)
- Priority placement at top of mobile navigation

#### Hero Variant (`variant="hero"`)
- Large, eye-catching CTA for landing pages
- Enhanced shadow and sizing (1.2rem padding, 2.5rem horizontal)
- Perfect for Recovery page hero and homepage

#### Sticky Variant (`variant="sticky"`)
- Fixed position floating button (bottom-right)
- Always accessible without scrolling
- Z-index 900 ensures visibility above content
- Rounded pill shape for modern look

#### Inline Variant (`variant="inline"`)
- Standard button sizing for in-content placement
- Flexible for articles, forms, and page sections
- Maintains crisis styling while being less intrusive

### 4. Accessibility Features
- ARIA labels and roles for screen readers
- Keyboard navigation support
- High contrast crisis-red color (#ef4444)
- Clear visual feedback on all interactions
- Pulsing help icon for urgency indication

## 🏗️ Architecture

### Component Structure
```
GetHelpNow.js
├── Props
│   ├── variant: 'mobile' | 'hero' | 'sticky' | 'inline'
│   ├── context: 'crisis' | 'recovery' | 'general'
│   └── onOpenAI: (prompt) => void
├── State
│   └── showEmergency: boolean
└── Features
    ├── handleGetHelp(): Opens AI or shows emergency modal
    ├── closeEmergency(): Dismisses modal
    └── Context-aware prompt generation
```

### FloatingAIWidget Enhancements
```javascript
// New Props
- initialPrompt: string | null
- autoSend: boolean

// Exposed Methods (via forwardRef)
aiWidgetRef.current.openWithPrompt(prompt) // Open with auto-send
aiWidgetRef.current.open() // Simple open
aiWidgetRef.current.close() // Close widget
aiWidgetRef.current.isOpen() // Check state
```

### Global Context System
```javascript
// App.js
AIWidgetContext
├── Provider wraps entire app
├── aiWidgetRef created with useRef
└── Passed to FloatingAIWidget via ref

// Usage in components
const aiWidgetRef = useAIWidget();
aiWidgetRef?.current?.openWithPrompt("I need help...");
```

## 📍 Implementation Locations

### 1. Mobile Menu (Priority Access)
**File**: `src/components/Navbar.js`
**Location**: Top of `.mobile-nav-links` list
**Variant**: `mobile`
**Context**: `crisis`
**Styling**: Red-tinted background with border separator

```javascript
<li className="mobile-help-item">
  <GetHelpNow 
    variant="mobile" 
    context="crisis"
    onOpenAI={handleGetHelp}
  />
</li>
```

### 2. Recovery Page Hero
**File**: `src/Views/Recovery.js`
**Location**: Replaces original "Get Help Now" scroll button
**Variant**: `hero`
**Context**: `crisis`
**Purpose**: Primary CTA for recovery resources

```javascript
<div className="hero-actions">
  <GetHelpNow 
    variant="hero" 
    context="crisis"
    onOpenAI={handleGetHelp}
  />
  <button className="btn-secondary">Explore Guide</button>
</div>
```

### 3. Future Placement Options
- **Sticky Footer**: Site-wide floating button (variant="sticky")
- **Tool Pages**: Crisis support during stress assessment or trigger tracking
- **Check-in Pages**: Support option when logging difficult emotions
- **Provider Directory**: Quick help when searching for therapists
- **Article Reader**: Support during difficult content consumption

## 🎨 Styling Highlights

### Button Base Styles
- **Gradient**: Linear gradient from #ef4444 to #dc2626
- **Shadow**: 0 4px 20px rgba(239,68,68,0.4)
- **Border Radius**: 12px for modern, approachable feel
- **Font Weight**: 700 (bold) for urgency and clarity
- **Transitions**: 0.3s ease on all interactive properties

### Pulse Animation
```css
@keyframes pulse-glow {
  0%, 100% { 
    opacity: 1; 
    filter: drop-shadow(0 0 4px rgba(255,255,255,0.8)); 
  }
  50% { 
    opacity: 0.7; 
    filter: drop-shadow(0 0 8px rgba(255,255,255,1)); 
  }
}
```

### Emergency Modal
- **Backdrop**: rgba(0,0,0,0.75) with 4px blur
- **Modal**: Dark gradient background with gold border
- **Cards**: Individual resource cards with hover effects
- **Responsive**: Full-height scrollable on mobile, centered on desktop
- **Animation**: Slide-up entrance with fade-in backdrop

## 🔍 AI Response Enhancement

### Crisis Detection Keywords
The AI now recognizes and prioritizes these terms:
- "crisis", "suicide", "hurt myself"
- "end" + "life" (combination)
- "help" + ("need" or "urgent")
- "emergency"

### Crisis Response Format
```markdown
🆘 **IMMEDIATE CRISIS SUPPORT**

If you're in crisis, you're not alone. Help is available 24/7:

**988 Suicide & Crisis Lifeline**
Call or text: 988

**SAMHSA National Helpline**
1-800-662-HELP (4357)

**Crisis Text Line**
Text HOME to 741741
```

## 📱 Mobile Optimization

### Touch Targets
- Minimum 44x44px tap areas (Apple HIG standard)
- 1rem padding on mobile variant links
- Generous spacing between interactive elements

### Viewport Considerations
- Modal uses `max-height: 90vh` for safe scrolling
- Sticky button positioned 60px from bottom (above mobile nav)
- Full-width mobile variant prevents accidental misses

### Performance
- CSS animations use GPU-accelerated properties (transform, opacity)
- Backdrop blur controlled with fallbacks
- Emergency modal lazy-loads on demand (not rendered until triggered)

## 🔐 Safety & Ethics

### Crisis Best Practices
1. **Immediate Access**: No navigation required, opens in-place
2. **Multiple Channels**: Phone, text, and online chat options
3. **Clear Labeling**: No ambiguity about what help is available
4. **24/7 Emphasis**: Users know help is always available
5. **Professional Resources**: All hotlines are professionally staffed

### Privacy Considerations
- No data collection on Get Help Now clicks
- Emergency modal doesn't track which resource is selected
- AI prompts are processed locally before being sent
- No personally identifiable information in crisis requests

## 🧪 Testing Checklist

### Functional Testing
- [x] Mobile menu integration working
- [x] Recovery page hero button functional
- [x] AI widget opens with correct context
- [x] Emergency modal displays all resources
- [x] Crisis hotline links are clickable (tel: and sms:)
- [x] Backdrop dismissal works correctly
- [x] Pulse animation plays smoothly

### Accessibility Testing
- [ ] Screen reader announces button purpose
- [ ] Keyboard navigation works (Tab, Enter, Esc)
- [ ] Focus trap in emergency modal
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Touch targets meet mobile guidelines

### Cross-Browser Testing
- [ ] Chrome/Edge (Chromium)
- [ ] Safari (iOS + macOS)
- [ ] Firefox
- [ ] Mobile browsers (iOS Safari, Chrome Android)

### Responsive Testing
- [ ] Mobile (320px - 480px)
- [ ] Tablet (768px - 1024px)
- [ ] Desktop (1200px+)
- [ ] Landscape orientations

## 📊 Deployment Status

### Git Commit
```
feat(help): add smart Get Help Now with AI integration
Commit: 715e966
```

### Firebase Hosting
**Live URL**: https://wellnesscafelanding.web.app
**Deployment Date**: December 2024
**Build Size**: 
- JS: 477.94 kB (gzipped)
- CSS: 45.51 kB (gzipped)

### GitHub
**Repository**: retrojunkjie1/wellnesscafe
**Branch**: main
**Status**: Pushed and synced

## 🚀 Future Enhancements

### Phase 2 Ideas
1. **Geolocation Integration**: Show local crisis centers based on user location
2. **Multilingual Support**: Crisis resources in Spanish, Chinese, etc.
3. **Session History**: Remember if user previously accessed crisis help
4. **Follow-up Prompts**: Check in after crisis interaction (opt-in)
5. **Resource Sharing**: Easy way to share crisis info with friends/family

### Advanced AI Features
1. **Sentiment Analysis**: Detect crisis tone in user messages
2. **Escalation Protocols**: Auto-suggest 911 for life-threatening situations
3. **Resource Recommendations**: Tailor suggestions based on conversation
4. **Conversation Continuity**: Remember context across multiple help requests

### Analytics (Privacy-Safe)
1. **Anonymous Usage Metrics**: How often is Get Help Now clicked?
2. **Conversion Tracking**: AI engagement vs. emergency modal fallback
3. **A/B Testing**: Test different button copy and placement
4. **Heatmaps**: Understand where users click for help most

## 📝 Developer Notes

### Adding New Placement
```javascript
import { useAIWidget } from '../App';
import GetHelpNow from '../components/GetHelpNow';

const MyComponent = () => {
  const aiWidgetRef = useAIWidget();
  
  const handleGetHelp = (prompt) => {
    if (aiWidgetRef?.current) {
      aiWidgetRef.current.openWithPrompt(prompt);
    }
  };
  
  return (
    <GetHelpNow 
      variant="inline" // or 'mobile', 'hero', 'sticky'
      context="recovery" // or 'crisis', 'general'
      onOpenAI={handleGetHelp}
    />
  );
};
```

### Customizing AI Prompts
Edit `GetHelpNow.js` lines 18-26 to modify context-aware prompts:
```javascript
const prompts = {
  crisis: "I'm in crisis and need immediate support. Can you help me?",
  recovery: "I need help with my recovery journey. What resources are available?",
  general: "I need help. What support options do you have?"
};
```

### Modifying Emergency Resources
Edit `GetHelpNow.js` lines 50-100 to add/update crisis hotlines:
```javascript
<div className="emergency-card crisis">
  <Phone className="card-icon" />
  <h3>New Crisis Hotline</h3>
  <p>Description of service</p>
  <a href="tel:+1234567890" className="emergency-link primary">
    Call 1-234-567-890
  </a>
</div>
```

## 🏆 Success Metrics

### User Experience Goals
- 95%+ mobile accessibility (all crisis info reachable in <3 taps)
- <2 second load time for emergency modal
- 0 navigation steps from crisis awareness to help

### Engagement Targets (Month 1)
- 100+ Get Help Now button interactions
- 50+ AI widget opens from crisis context
- 25+ emergency resource modal views

### Impact Indicators
- Positive user feedback on crisis support
- Reduced bounce rate on Recovery page
- Increased time-on-site for users accessing help features

## 🙏 Acknowledgments

This feature prioritizes user safety and adheres to crisis intervention best practices. All hotline resources are verified, professionally staffed, and available 24/7.

**Crisis Resources Referenced**:
- [988 Suicide & Crisis Lifeline](https://988lifeline.org/)
- [SAMHSA National Helpline](https://www.samhsa.gov/find-help/national-helpline)
- [Crisis Text Line](https://www.crisistextline.org/)

---

## 📞 Emergency Contact Information

**If you are in a life-threatening situation, call 911 immediately.**

**988 Suicide & Crisis Lifeline**: Call or text 988 (24/7 free and confidential)
**SAMHSA National Helpline**: 1-800-662-HELP (4357) - 24/7 treatment referral
**Crisis Text Line**: Text HOME to 741741 - 24/7 crisis counseling via text
