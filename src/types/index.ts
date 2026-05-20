// src/types/index.ts

// --- VISUALIZATION TYPES ---
export interface Point {
  x: number;
  y: number;
  label?: string;
  color?: string;
}

export interface VisualizerState {
  points: Point[];
  meta: any; // Algorithm-specific metadata (e.g., centroids, regression lines)
  currentStep: number;
  explanation: string;
  isCompleted: boolean;
}

export interface AlgorithmParam {
  id: string;
  name: string;
  min: number;
  max: number;
  value: number;
  step: number;
}

// --- EDUCATIONAL ML TYPES ---
export type LearningParadigm = 'Supervised' | 'Unsupervised' | 'Reinforcement' | 'Deep Learning';
export type TaskType = 'Classification' | 'Regression' | 'Clustering' | 'Dimensionality Reduction' | 'Sequence/Vision';
export type Level = 'High' | 'Medium' | 'Low';

export interface MLMetrics {
  paradigm: LearningParadigm;
  task: TaskType[];
  interpretability: Level;
  trainingSpeed: Level;
  inferenceSpeed: Level;
  dataHunger: Level;
  requiresScaling: boolean;
  robustToOutliers: boolean;
  pros: string[];
  cons: string[];
}