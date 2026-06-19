# 🚀 Obsidian Hunt
### *"Never Miss Humanity's Next Leap"*

[![Vite](https://img.shields.io/badge/Vite-B73BFF?style=for-the-badge&logo=vite&logoColor=FFD62B)](https://vite.dev/)
[![React 19](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![ThreeJS](https://img.shields.io/badge/ThreeJS-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)

Welcome to **Obsidian Hunt**, a premium, highly interactive flight operations and telemetry console designed to look and feel like opening a mission control center at NASA or SpaceX Starbase. 

Unlike standard "list of cards" student templates, **Obsidian Hunt** is engineered as a real-time command dashboard complete with custom WebGL graphics, canvas charting loops, automated flight checklists, and a search console designed to capture recruiter attention immediately.

---

## 🎨 Design Philosophy & HUD Aesthetics

The design merges the styling cues of a military flight deck, sci-fi HUD telemetry, and modern premium glassmorphism interfaces:

*   **Color System**: Deep Space Void (`#020204`), Nebula Navy (`#090d1a`), and Cyber Slate (`#13192b`).
*   **Color Accents**: Neon Cyan (`#00f0ff`) representing active/online systems and telemetry feeds; Rocket Orange (`#ff6b00`) representing booster combustion and alerts.
*   **Visual Atmosphere**: 
    *   *Moving Starfields*: Lightweight keyframe particle animations.
    *   *Scanline Overlays*: Vertical looping grid filters representing high-contrast military CRT monitors.
    *   *Cyber Grid Backdrops*: Sleek coordinate lines mapping spatial alignment.
    *   *Tabular Figures*: Monospaced typography rules on numerical fields (timestamps, speeds, and coordinates) to prevent visual layout shifts during ticks.

---

## 🛰️ Core Feature Set

| Feature | Portfolio Impact Score | Description |
| :--- | :---: | :--- |
| **Interactive 3D WebGL Globe** | **10/10** | Custom procedurally wireframed Earth globe built with vanilla Three.js. Maps global spaceports (Florida, Texas, India, Kourou), renders parabolic trajectory arches, and supports click details with draggable rotation controls. |
| **Telemetry Flight Desk Modal** | **9/10** | Clicking any mission opens a deep telemetry board featuring an interactive flight timeline checklist, current staging status indicators, and real-time velocity curves. |
| **Live Canvas Telemetry Charts** | **9/10** | High-performance HTML Canvas rendering loops plotting velocity/apogee curves. Supports interactive commands: **Initiate Flight** triggers staged climbs; **Abort Command** triggers emergency alerts and screen vibration shakes. |
| **Spotlight Command Search** | **8/10** | Global keyboard search overlay (`Cmd+K` or `Ctrl+K`) that searches upcoming manifests, historical databases, and rocket specs with instant match highlights. |
| **OS Boot Terminal Loader** | **8/10** | Immersive booting console that prints mock telemetry initialization logs, progress bars, and a rocket liftoff animation before entering the console dashboard. |
| **Rocket Fleet Gallery** | **7/10** | Glassmorphic specifications carousel containing detailed engineering specs (height, thrust, propellant type, stages, and payload capacity) for active fleets (Falcon 9, Starship, SLS). |
| **Mobile Dock Navigation** | **7/10** | Responsive floating bottom app bar optimized for mobile touch viewports, supporting smooth section anchor scrolling. |

---

## ⚙️ Tech Stack & Dependencies

*   **Core Framework**: React 19 & Vite 8 (fast, modern ES module bundling)
*   **Styling**: Tailwind CSS v4 (incorporating `@tailwindcss/vite` for CSS variable compilation)
*   **Graphics Engine**: Three.js (WebGL 3D Earth)
*   **Animation**: Framer Motion (fluid spring-physics state transitions)
*   **Iconography**: Lucide React (aerospace vectors)
*   **Data Controller**: Fail-safe hybrid model that bridges remote API requests with offline mock datasets.

---

## 📂 Project Architecture

```text
src/
├── main.jsx              # React Entry
├── index.css             # Tailwind v4 imports, Starfield animations, Cyber Grid utilities
├── App.jsx               # Application coordinator (modal targets, scroll listeners, clock)
├── data/
│   └── mockLaunchData.js # Dataset (launch sites, specs, telemetry curves, history)
└── components/
    ├── Loader.jsx        # Booting HUD terminal & progress bar
    ├── Navbar.jsx        # Glassmorphic header, UTC clock, status flags
    ├── Hero.jsx          # Live ticking countdown & flight HUD
    ├── Stats.jsx         # Counter panels rolling up on load
    ├── UpcomingLaunches.jsx # Horizontal card track with countdown clocks
    ├── FeaturedMission.jsx  # Flagship showcase & live Canvas graph
    ├── Globe3D.jsx       # Three.js 3D Earth, bezier trajectories, and coordinates
    ├── Timeline.jsx      # Scroll-triggered upcoming milestone nodes
    ├── RocketGallery.jsx # Carousel detailing vehicle engineering specs
    ├── LaunchHistory.jsx # Tabular log database with status filters
    ├── SearchOverlay.jsx # Mac Spotlight-style overlay (Cmd+K)
    ├── ConsoleModal.jsx  # Detailed telemetry desk (Initiate/Abort commands, shakes)
    └── Footer.jsx        # Mobile navigation dock
```

---

## 🚀 Setup & Installation (Local Execution)

Follow these commands to run the project locally:

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
    Navigate to the URL printed in the terminal (usually `http://localhost:5173`).

---

## 🌐 Production Deployment

Since the project builds into static assets, it can be deployed to **Netlify** or **Vercel** for free:

### Netlify Continuous Integration (Recommended)
1. Push your code to a GitHub repository.
2. Log in to [Netlify](https://www.netlify.com).
3. Click **Add new site** > **Import an existing project** > Select your **GitHub** repo.
4. Netlify will auto-detect Vite compile settings:
    *   **Build Command**: `npm run build`
    *   **Publish Directory**: `dist`
5. Click **Deploy**. Any future push to your `main` branch will automatically build and publish updates.
