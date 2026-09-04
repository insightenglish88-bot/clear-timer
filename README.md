# Clear Timer

**Clear Timer** (`clear-timer`) is an adaptive multi-tier interactive timer engineered for three distinct learner demographics: Young Learners English (YLE), Middle School study intervals, and Business English presentation pacing.

---

## 🎯 Adaptive Learner Profiles

### 1. 🎒 Mode A: YLE Learners (Young Learners English)
- **Visual Language**: Vibrant high-contrast palette, bold rounded tactile controls, cartoon styling.
- **Core Features**: 
  - 5-second human voice speech countdown (*"5, 4, 3, 2, 1, GO!"*).
  - Screen-filling numerals with circular progress rings.
  - Team Time Scoreboard with finish time tracking (`-1s`, `+1s`, `+5s` modifiers) and fastest-team leader badges.
  - 100% opaque privacy shield vault cover for blind speaking games.

### 2. 📚 Mode B: Middle School (Study & Focus Blocks)
- **Visual Language**: Clean, energetic aesthetic with structured task cards and modern indigo/violet styling.
- **Core Features**:
  - Focus / Break interval presets (25m Pomodoro Study, 5m Quick Break, 15m Drill, 45m Deep Work).
  - Interactive study task cards with completion check-off and time tracking.

### 3. 💼 Mode C: Business English (Executive Presentation Pacing)
- **Visual Language**: Distraction-free minimalist executive styling (slate, navy, muted neutrals).
- **Core Features**:
  - Speech rehearsal presets (2m Elevator Pitch, 5m Lightning Talk, 15m Keynote, 30m Board Review).
  - Real-time Pacing Monitor:
    - 🟢 **On Track** (0% – 80% elapsed)
    - 🟡 **Wrap-up Window** (80% – 100% elapsed)
    - 🔴 **Overtime Alert** (> 100% elapsed)
  - Meeting agenda item and speaking points duration tracker.

---

## ⌨️ Global Keyboard Shortcuts
- `Space`: Start / Pause / Resume
- `C`: Toggle Privacy Vault Cover
- `R`: Reset Timer

---

## 🚀 Local Development Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables** (Optional for Firebase):
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

4. **Build Production Bundle**:
   ```bash
   npm run build
   ```

---

## 🛡️ Automated SecOps & Quality Routines

- **Full 5-Layer Security Audit**:
  ```bash
  npm run secops
  ```
- **Pre-Commit Secret Scanner**:
  ```bash
  npm run secops:scan
  ```
- **Install Local Git Pre-Commit Hook**:
  ```bash
  npm run secops:install-hooks
  ```
- **Automated CI/CD**:
  GitHub Actions automatically audits and tests every push and pull request via [.github/workflows/secops.yml](.github/workflows/secops.yml).