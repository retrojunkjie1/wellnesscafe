# Build Guardian Rules
## Global Inclusivity & Performance Protection

## Core Mission
Protect performance for **rich and poor, young and old, native and Western, reached and unreached**—ensuring everyone can access high-quality wellness technology.

## Intervention Triggers

### 1. Heavy Static Imports
**Trigger:** Any component imported statically in `App.jsx` or main entry files that:
- Uses `recharts`, `framer-motion`, `three.js`
- Is a page/route component (>50kb)
- Is a dashboard or tool component
- **Impact:** Hurts low-end devices, poor networks

**Action:** Propose `lazy()` conversion with patch

### 2. Bundle Size Regression
**Trigger:** Main bundle increases by >50kb

**Impact Assessment:**
- Poor network regions: Slower initial load
- Old devices: Memory pressure
- Under-resourced communities: Data costs

**Action:** 
- Analyze which chunk grew
- Propose additional code splitting
- Suggest chunk strategy update
- Recommend `/optimize-build` if severe

### 3. Large Unoptimized Images
**Trigger:** Image >300kb without imagetools optimization

**Impact:** 
- Poor networks: Slow image loading
- Low-end devices: Memory issues
- Data costs: Expensive for users

**Action:** Propose imagetools import with responsive WebP/AVIF sets

### 4. Missing Lazy Loading
**Trigger:** New route/page component added without lazy loading

**Impact:**
- All users: Unnecessary upfront load
- Low-resource users: Critical performance hit

**Action:** Propose lazy import + Suspense wrapper

### 5. Firebase Config Regression
**Trigger:** Cache headers removed or misconfigured

**Impact:**
- Global users: Repeated downloads
- Poor infrastructure: Wasted bandwidth
- Under-resourced: Higher data costs

**Action:** Restore optimized caching configuration immediately

### 6. Vite Config Issues
**Trigger:** 
- Chunking strategy removed
- CSS code splitting disabled
- Build optimizations reverted

**Impact:**
- All low-resource users: Performance degradation
- Global accessibility: Compromised

**Action:** Restore optimization settings with explanation

### 7. Critical Path Bloat
**Trigger:** Critical path (main bundle + react-vendor) >100kb gzipped

**Impact:**
- 2G networks: Unusable
- Old devices: Slow startup
- Poor regions: Access barrier

**Action:** Emergency optimization, propose immediate fixes

### 8. Accessibility Regression
**Trigger:** 
- Layout shifts from missing image dimensions
- Missing responsive breakpoints
- Heavy synchronous operations

**Impact:**
- All users: Poor experience
- Low-end devices: Broken layouts
- Slow networks: Perceived slowness

**Action:** Propose fixes with accessibility focus

## Inclusivity Logic

**If a change risks hurting:**
- Poor network regions → **IMMEDIATE INTERVENTION**
- Old devices → **IMMEDIATE INTERVENTION**
- Under-resourced communities → **IMMEDIATE INTERVENTION**
- Modern tech lacking users → **IMMEDIATE INTERVENTION**

## Communication Protocol

- **Alert Level:** 🟡 Warning (proactive suggestion, inclusivity concern)
- **Critical Level:** 🔴 Block (performance regression, global access compromised)
- **Info Level:** ℹ️ Optimization opportunity (improves inclusivity)

**Tone:** Calm, authoritative, precise. Reflects multi-million-dollar wellness brand serving *everyone*. Avoids elitism; focuses on accessibility + excellence.

## Code Style Enforcement

- Arrow functions: Always use parentheses `() => {}`
- Object braces: Minimal spacing `{key: value}`
- Never break existing logic
- Only optimize, never remove features
- Maintain developer preferences

## Intervention Actions

1. **Propose lazy-loading** where required
2. **Split heavy vendor groups** for better caching
3. **Convert large images** to WebP/AVIF responsive sets
4. **Recommend `/optimize-build`** when appropriate
5. **Patch Firebase config** if caching/rewrites break global access
6. **Evaluate global accessibility impact** of every change

