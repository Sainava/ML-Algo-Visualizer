# AlgoScope ML

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![React](https://img.shields.io/badge/React-18.x-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)

**An interactive, step-by-step visualizer for machine learning algorithms built natively for the browser.**

AlgoScope ML bridges the gap between abstract mathematical formulas and visual understanding. By breaking down complex algorithms into interactive, frame-by-frame SVG animations, we make machine learning accessible, intuitive, and highly interactive.

Live Demo: [algoscope-ml.vercel.app](https://ml-algo-visualizer.vercel.app/)

---

## The Architecture: "Shell and Slot"

AlgoScope ML is engineered specifically for open-source scalability and easy onboarding. You do not need to understand the entire codebase to contribute! 

We use a **"Shell and Slot"** architecture:
* **The Shell (Global):** Handles the dark-mode dashboard, playback controls, algorithm selection, and dynamic metrics parsing.
* **The Slot (Local):** A perfectly isolated React component where your algorithm lives. 

**Want to add an algorithm?** You just bring the math and draw the SVG. The global shell handles the rest automatically.

---

## Quick Start (Local Development)

To get the engine running on your local machine:

```bash
# 1. Clone the repository
git clone [https://github.com/YOUR-USERNAME/algoscope-ml.git](https://github.com/YOUR-USERNAME/algoscope-ml.git)

# 2. Navigate into the directory
cd algoscope-ml

# 3. Install dependencies
npm install

# 4. Start the Vite development server
npm run dev

```

---

## How to Contribute

We are actively looking for contributors to help expand our algorithm library! Whether you want to build a simple K-Nearest Neighbors visualizer or tackle a complex Support Vector Machine, there is a place for you here.

**The Workflow:**

1. Check our [Issues Tab](https://www.google.com/search?q=https://github.com/YOUR-USERNAME/algoscope-ml/issues) for an algorithm that needs building, or open a new issue proposing one.
2. Read our detailed **[Contribution Guide](https://www.google.com/search?q=.github/CONTRIBUTING.md)** (It takes 3 minutes and explains the exact blueprint you need to follow).
3. Duplicate the `src/algorithms/implemented/kmeans` template folder to start building.
4. Submit your PR!

---

## Tech Stack

* **Core:** React (TypeScript)
* **Build Tool:** Vite
* **Styling:** Tailwind CSS v4
* **Icons:** Lucide React
* **Rendering Engine:** Native SVG DOM manipulation

```