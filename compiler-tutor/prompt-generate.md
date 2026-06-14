You are an expert frontend engineer and instructional designer. Build a premium, interactive React web application using Vite as a tutor/study companion for a university course on [INSERT COURSE NAME (e.g., Operating Systems, Computer Networks)].

The application must feel highly professional, gamified, and modern. Follow the structure, architectural patterns, and design system guidelines below.

---

### 1. TECH STACK & ARCHITECTURE

- **Core**: React 18+ (using Vite) and Vanilla CSS. Do not use Tailwind CSS or complex state management libraries (use React's `useState`, `useEffect`, `useCallback`, `useMemo`).
- **Local JSON Database (Vite Middleware)**:
  - Inside `vite.config.js`, implement a custom development server middleware on the `configureServer` hook.
  - Expose API endpoints: `GET /api/progress` and `POST /api/progress`.
  - Read/write study progress (completed modules list and active module ID) to a root-level `db.json` file on disk.
  - Ensure the React application handles initial loading asynchronously and saves state changes to the API, falling back to `localStorage` if the server is unreachable.
- **Auto-scroll**: Upon switching modules, the page must automatically scroll back to the top (`window.scrollTo(0,0)`).

---

### 2. DESIGN SYSTEM & VISUALS (Vanilla CSS)

- **Theme**: Premium dark mode dashboard.
  - Background: Deep slate/navy (e.g., `#0B0F19` or `#0F172A`).
  - Cards & Sidebar: Dark grey/blue (e.g., `#1E293B` or `#1F2937`).
  - Borders: Subtle grey/blue borders (e.g., `1px solid #334155`).
  - Text: High-contrast white (`#FFFFFF`) for headers, muted grey (`#94A3B8`) for body, and a highlighted accent color (e.g., blue `#3B82F6` or emerald `#10B981`) for active items/buttons.
- **Layout**:
  - Two-column dashboard layout: a fixed left sidebar (with logo, list of modules grouped into phases, and a progress bar) and a main scrollable content pane.
  - The sidebar should group modules into two phases: **Phase 1 (Fundamentals)** and **Phase 2 (Advanced Topics)**.
  - Phase 2 modules must display a lock icon and be disabled/unclickable until all Phase 1 modules are marked as completed.
  - Include an overlay/banner celebration animation when Phase 2 is unlocked.

---

### 3. MODULE STRUCTURE & PEDAGOGY

Divide the course content into [INSERT NUMBER OF MODULES] structured modules. Each module must contain:

1. **Theoretical Section**: High-quality, clear explanations of key concepts using bullet points, tables, and comparison charts.
2. **Interactive Simulator/Visualizer**: 
   - A hands-on visual tool that lets the user step through an algorithm, construct something, or trace execution (e.g., a stack simulator, step-by-step algorithms, or interactive tree construction).
   - Use custom SVG-based visual layouts where possible to render structures (e.g., trees, state transitions, or processes).
3. **Module Quiz**:
   - A dedicated `Quiz` component containing 3 multiple-choice questions.
   - Show instant feedback on selection, and highlight correct vs. incorrect answers.
   - Completion of the quiz/module marks that module ID as "completed" in the database.

---

### 4. SPECIFIC COURSE CONTENT TO COVER

Here is the syllabus and key interactive features that need to be generated for [INSERT COURSE NAME]:

[INSERT DETAILED TOPICS LIST AND DESIRED INTERACTIVE SIMULATORS HERE. Example for Operating Systems:
- Module 1: Process Management (Interactive CPU Scheduling Simulator with Gantt Chart)
- Module 2: Memory Management (Interactive Paging / Page Replacement Simulator)
- Module 3: Storage & File Systems (Interactive Disk Scheduling Simulator)
- Module 4: Concurrency & Semaphores (Step-by-step Producer-Consumer visualizer)
]
