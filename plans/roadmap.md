# Roadmap: Perfecting Aethera Apex Trading Demo

This document outlines the strategic plan to transition the Aethera Apex Trading Demo from a functional prototype to a robust, feature-rich application suitable for production and deployment in kiosk environments.

## Phase 1: UX/UI Polish & Interaction (Immediate)
*Goal: Enhance the "feel" of the application to match the high-stakes trading theme.*

- [ ] **Sound Design:** Add subtle sound effects for:
    - Button clicks (mechanical/tactile sounds).
    - Success/Match (positive chime).
    - Mismatch (warning tone).
    - Timer tick (subtle clock or heartbeat).
- [ ] **Visual Feedback:**
    - Improve transitions between Game -> Explanation -> Game to be seamless.
- [ ] **Mobile Responsiveness:**
    - Ensure all charts and buttons are touch-friendly on smaller screens (though Kiosk is primary).
    - Fix potential layout shifts on soft keyboard open (Enter Name screen).

## Phase 2: Real Content Integration
*Goal: Replace mock data with realistic trading scenarios.*

- [ ] **TradingView Integration:**
    - Replace static placeholder with `lightweight-charts` (by TradingView) or `react-tradingview-widget`.
    - Feed real historical data snapshots (candlesticks) instead of static images or text.
- [ ] **Scenario Expansion:**
    - Create a library of 50+ curated scenarios (Trend Following, Reversal, Range, Breakout).
    - Tag scenarios with metadata (Market Condition, Volatility, Asset Class).
- [ ] **Dynamic "Apex" Logic:**
    - Instead of hardcoded "Ground Truth", implement a simple rule-based engine or call a real backend that evaluates the chart data to generate the "Apex Decision" dynamically.

## Phase 3: Backend & Multiplayer Robustness
*Goal: Move from hybrid/mock socket logic to a production-ready backend.*

- [ ] **Node.js Server:**
    - Finalize the `server/index.js` (Socket.io).
    - Implement persistent Rooms in Redis or memory.
    - Handle edge cases: Player disconnects, Host leaves, Reconnection.
- [ ] **Real-time Sync:**
    - Ensure all players see the *exact* same timer countdown.
    - Sync "Next Scenario" transitions perfectly.
    - Show live "Opponent Progress" (e.g., "3/4 players have decided").

## Phase 4: Data & Analytics (Admin Features)
*Goal: Capture value from the Kiosk/Demo usage.*

- [ ] **Lead Capture Backend:**
    - Connect the Results Screen email form to a real database (Supabase, Firebase, or Google Sheets via API).
    - Send an automated "Mission Report" email to the user with their score.
- [ ] **Admin Dashboard:**
    - View live active rooms.
    - See aggregate stats: Average Score, Most Missed Scenarios, Total Leads Captured.
- [ ] **Leaderboard:**
    - Global Leaderboard (Daily/Weekly) to encourage competition at events.

## Phase 5: Deployment & Hardware
*Goal: Get it running on the Kiosk.*

- [ ] **Kiosk Mode:**
    - Configure Chrome/Edge Kiosk Mode.
    - Disable context menus, gestures, and exits.
- [ ] **Offline Resilience:**
    - Cache scenarios locally (PWA/Service Worker) so the app works even if internet flutters.
- [ ] **Hardware Integration:**
    - (Optional) Support physical arcade buttons for Up/Down/Flat for immersive experience.

## Feature Ideas Backlog
- **"Pro Mode":** Users can draw trendlines on the chart before deciding.
- **"Challenge Friend":** Direct 1v1 duel link.
- **"Apex Commentary":** Voiceover reading the rationale.
