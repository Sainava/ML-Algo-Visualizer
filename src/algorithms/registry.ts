// src/algorithms/registry.ts
import { KMeansAlgorithm } from './implemented/kmeans/logic';
import { KMeansCanvas } from './implemented/kmeans/KMeansCanvas';

export const AlgorithmRegistry = {
  kmeans: {
    blueprint: KMeansAlgorithm,
    canvasComponent: KMeansCanvas
  }
  // In the future, a contributor just adds their linear_regression here
};

export type AvailableAlgorithms = keyof typeof AlgorithmRegistry;