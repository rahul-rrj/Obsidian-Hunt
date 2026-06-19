# 🛰️ OBSIDIAN HUNT // Mission Control Center
### *A Premium, Immersive Aerospace Operations Dashboard & Telemetry Visualizer*

---

## 📌 Mission Objective (Project Overview)

**Obsidian Hunt** is a premium, high-fidelity web application styled after a modern aerospace command center (inspired by SpaceX Starbase and NASA Flight Operations). Breaking away from standard, static portfolio cards, this project delivers an interactive dashboard displaying mock and live spaceflight telemetry, flight path vectors, orbital coordinates, and launch timelines.

The primary objective is to demonstrate proficiency in high-performance WebGL graphics, canvas rendering loops, modular React state coordination, and modern Tailwind v4 styling frameworks.

---

## 🛠️ Technology Stack & Tools Used

The application is built on a modern frontend architecture selected for rendering speed, modularity, and fluid visual animations:

### 1. Core Framework & Bundler
*   **React 19**: Leverages React's component-driven architecture to manage complex, overlapping UI states (e.g., launching modals, search overlays, active navigation sections) and handles virtual DOM updates efficiently.
*   **Vite 8**: Serves as the build tool and development server, utilizing native ES modules for instantaneous Hot Module Replacement (HMR) and optimized Rollup-based production chunking.

### 2. Styling & HUD Theme Engine
*   **Tailwind CSS v4**: Integrated using the official `@tailwindcss/vite` compiler plugin. Themes are defined directly inside `src/index.css` using the `@theme` directive, which compiles variables into utility classes.
*   **Custom CSS Effects**:
    *   *CRT Scanlines*: A linear-gradient overlay loop mimicking retro military radar monitors.
    *   *Cyber Grid Backdrops*: Vector grids providing spatial alignment.
    *   *Starfield Parallax*: CSS-animated vertical scrolling star particles.
    *   *Tabular Figures*: Monospaced font configuration (`font-mono` using JetBrains Mono) that keeps layout positions stable while telemetry coordinates and countdown timers update.

### 3. Graphics & Animation Libraries
*   **Three.js (WebGL)**: Powers the interactive 3D Globe. Implemented inside a vanilla React `useRef` to maintain lightweight DOM attachment and prevent version conflicts with React 19.
*   **HTML Canvas API**: Used in the featured banner and flight controller modals to render real-time telemetry curves, grid axes, and rocket apogee trajectories without taxing the main DOM thread.
*   **Framer Motion**: Manages smooth spring-physics micro-interactions (e.g., card tilts, button scale reactions, fade-in lists, and modal slide-ins).
*   **Lucide React**: Provides sleek, vector-based aerospace iconography.

---

## 🔌 Data Layer & APIs Used

To ensure robust uptime and prevent rate-limiting or CORS issues during portfolio reviews, the application utilizes a **hybrid API architecture**:

### 1. SpaceX API
*   **Endpoints Queried**: `/v4/launches` and `/v4/rockets`.
*   **Usage**: Provides data regarding launch sites (Vandenberg, Cape Canaveral), rocket specs (height, thrust, mass), payloads (Dragon, Starlink), and historical flight success rates.

### 2. Launch Library 2 API
*   **Usage**: Used to fetch global spaceflight scheduling datasets, including international launch manifests (ISRO, ESA, Arianespace).

### 3. Fail-Safe Hybrid Telemetry Controller
*   **The Controller**: If external requests fail, time out, or hit CORS blockades, the app immediately redirects data flow to `src/data/mockLaunchData.js`.
*   **Mock Content**: A comprehensive backup dataset detailing coordinates, checklist staging phases (Propellant Load, Guidance Lock, Max Q, Orbit Insertion), and telemetry coordinate curves. This ensures 100% uptime for recruiter demonstrations.

---

## 🎛️ Detailed Component Breakdown

### 1. Mission Control Boot Screen (`Loader.jsx`)
*   Simulates a cold boot sequence for the dashboard operating system.
*   Prints mock shell logs dynamically (e.g., `Establishing downlink... OK`, `Synchronizing trajectories... OK`).
*   Displays an incremental percentage calculator (0% to 100%) and a glowing progress bar before executing a slide-up exit transition.

### 2. Flight Dashboard HUD (`Hero.jsx` & `Stats.jsx`)
*   **Live Countdown**: Calculates and displays a ticking timer (T-Minus Days, Hours, Minutes, Seconds) to the nearest upcoming launch.
*   **Interactive Telemetry HUD**: Generates mock guidance values (Speed, Altitude, Pitch, Yaw, Roll) that vibrate and update every 150ms to simulate active flight.
*   **Animated Stats**: Evaluates Total Launches, Success Rate, and Upcoming Manifests, counting up from zero when scrolled into view.

### 3. Horizontal Manifest Cards (`UpcomingLaunches.jsx`)
*   Renders upcoming missions in a horizontal scrollbar.
*   Each card hosts its own countdown timer ticking independently.
*   Features glassmorphic borders that glow neon-cyan on mouse hover.

### 4. Featured Mission Trajectory (`FeaturedMission.jsx`)
*   Widescreen showcase utilizing a parallax background.
*   Houses a live HTML Canvas telemetry visualizer drawing an orbital apogee curve with wave noise.

### 5. WebGL 3D Interactive Earth (`Globe3D.jsx`)
*   Renders a 3D Earth mesh using a procedural wireframe material.
*   Plots launch sites globally based on latitude and longitude coordinates.
*   Draws glowing Bezier curves projecting flight trajectories into orbit.
*   Captures drag events for rotation and click raycasting to open overlays showing coordinates and active manifests.

### 6. Archival Log Database (`LaunchHistory.jsx` & `SearchOverlay.jsx`)
*   **Spotlight Search**: Pressing `Cmd+K` / `Ctrl+K` opens a search overlay matching query strings against rockets and launch pads.
*   **History Logs**: Grid database showing historical successes and failures, filterable by status or launch vehicle.

### 7. Flight Director Console (`ConsoleModal.jsx`)
*   Opens a full-screen command dashboard for selected launches.
*   Includes a checklist where staging events complete sequentially as the simulation progresses.
*   Features **Initiate Flight** (resets and plays the velocity curve) and **Abort Command** (stops telemetry, flashes warning grids, and shakes the console screen).

---

## 📁 Directory Structure

```text
src/
├── main.jsx              # React mounting root
├── index.css             # Tailwind v4 directives, grids, scanlines, and starfields
├── App.jsx               # Main state manager (loader switches, modal targets, clock loops)
├── data/
│   └── mockLaunchData.js # Offline backup database (coordinates, checklist phases, vectors)
└── components/
    ├── Loader.jsx        # Boot logs terminal & progress bar
    ├── Navbar.jsx        # Translucent glassmorphic header, UTC clock, status dots
    ├── Hero.jsx          # Live launch countdown & telemetry cockpit
    ├── Stats.jsx         # Count-up panels (Launches, Success Rate, Manifests)
    ├── UpcomingLaunches.jsx # Horizontal card swipe with card clocks
    ├── FeaturedMission.jsx  # Banner and HTML Canvas telemetry graph
    ├── Globe3D.jsx       # ThreeJS 3D Earth, bezier curves, drag orbit rotations
    ├── Timeline.jsx      # Scroll-triggered upcoming milestone nodes
    ├── RocketGallery.jsx # Carousel displaying rocket specs (Falcon 9, Starship, SLS)
    ├── LaunchHistory.jsx # Searchable log database with status filters
    ├── SearchOverlay.jsx # Spotlight search overlay (Cmd+K)
    ├── ConsoleModal.jsx  # Flight controller desk (Initiate/Abort commands, shakes)
    └── Footer.jsx        # Mobile navigation dock
```

---

## 🚀 Local Installation & Commands

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/Obsidian-Hunt.git
    cd Obsidian-Hunt
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Run the local development server**:
    ```bash
    npm run dev
    ```
4.  **Open in your browser**:
    Navigate to `http://localhost:5173`.

---

## 🌐 Production Build & Deployment

To compile the application into static, optimized assets:
```bash
npm run build
```
This outputs a `dist/` folder containing the minified files.

### Hosting on Netlify (Continuous Deployment)
1. Link your GitHub repository to [Netlify](https://www.netlify.com).
2. Configure settings:
    *   **Build Command**: `npm run build`
    *   **Publish Directory**: `dist`
3. Click **Deploy**. Any future commits pushed to the `main` branch will trigger an automatic rebuild.
