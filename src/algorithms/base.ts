// src/algorithms/base.ts
import { VisualizerState, MLMetrics, AlgorithmParam } from '../types';

export interface AlgorithmBlueprint {
  id: string;
  name: string;
  shortDescription: string;
  category: string; // Used for grouping in the dropdown
  metrics: MLMetrics;
  
  // Default parameters the algorithm needs (e.g., K for K-Means)
  defaultParams: AlgorithmParam[];
  
  // The lifecycle methods
  initialize: (width: number, height: number, params: AlgorithmParam[]) => VisualizerState;
  nextStep: (currentState: VisualizerState, params: AlgorithmParam[]) => VisualizerState;
}