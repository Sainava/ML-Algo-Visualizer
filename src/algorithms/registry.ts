// src/algorithms/registry.ts
import { KMeansAlgorithm } from './implemented/kmeans/logic';
import { KMeansCanvas } from './implemented/kmeans/KMeansCanvas';
import { LinearRegressionAlgorithm } from './implemented/linear-regression/lrLogic';
import { LinearRegressionCanvas } from './implemented/linear-regression/LinearRegressionCanvas';

export const AlgorithmRegistry = {
  kmeans: {
    blueprint: KMeansAlgorithm,
    canvasComponent: KMeansCanvas
  },
  'linear-regression': {
    blueprint: LinearRegressionAlgorithm,
    canvasComponent: LinearRegressionCanvas
  }
};

export type AvailableAlgorithms = keyof typeof AlgorithmRegistry;