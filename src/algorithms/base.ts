import { Point, VisualizerState } from '../types';

export interface AlgorithmBlueprint {
  name: string;
  description: string;
  
  // Generates the initial random data points on canvas load
  initialize: (width: number, height: number) => VisualizerState;
  
  // Takes the current state and returns the mathematically calculated next step
  nextStep: (currentState: VisualizerState) => VisualizerState;
}