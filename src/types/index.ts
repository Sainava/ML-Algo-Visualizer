export interface Point {
  x: number;
  y: number;
  label?: string; // e.g., "Cluster A"
  color?: string; // Assigned color for visualization
}

export interface VisualizerState {
  points: Point[];
  meta: any;       // Algorithm-specific data (like centroid positions, lines of best fit)
  currentStep: number;
  explanation: string; // Explains what's happening on screen right now
  isCompleted: boolean;
}