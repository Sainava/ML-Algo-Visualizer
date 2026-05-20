# Contributing to AlgoScope ML 

First off, thank you for considering contributing to AlgoScope! We want to make adding new machine learning algorithms as easy and enjoyable as possible.

## The "Shell and Slot" Architecture

AlgoScope is designed so you **do not need to understand the entire dashboard** to contribute. 
* The **Global Shell** handles the UI, playback controls, and dark mode.
* The **Local Slot** is where your algorithm lives.

When adding an algorithm, you only need to write pure math and basic SVG. The dashboard will automatically read your algorithm's properties and generate the interactive sidebars for you.

## How to Add a New Algorithm

Follow these 4 exact steps to get your algorithm merged:

### Step 1: Duplicate the Template
1. Navigate to `src/algorithms/implemented/`.
2. Duplicate the `kmeans/` folder and rename it to your algorithm (e.g., `knn/`, `decision-tree/`).

### Step 2: Implement the Math Logic
Open your new `logic.ts` file. You must satisfy the `AlgorithmBlueprint` interface.
* Fill out the `metrics` object (this automatically generates the educational UI on the right panel).
* Write your `initialize` function (sets up the random data).
* Write your `nextStep` function (the pure mathematical step that moves the algorithm forward one frame).

### Step 3: Draw the Canvas
Open your `Canvas.tsx` file. 
* Read your data points from `const { state } = useVisualizer();`.
* Map over your data to return standard SVG elements (`<circle>`, `<line>`, `<rect>`).
* **Do not** add standard HTML divs or complex CSS layouts here. Keep it pure SVG inside the `viewBox`.

### Step 4: Register It
Open `src/algorithms/registry.ts` and add your new algorithm to the `AlgorithmRegistry` object. 

## Pull Request Guidelines
* Keep your PR scoped to **one algorithm** at a time.
* Do not modify `App.tsx`, `VisualizerContext.tsx`, or any files in the `components/` folder unless you are explicitly fixing a global UI bug.
* Test your algorithm using the Play/Pause buttons locally before submitting.