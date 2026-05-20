// src/algorithms/implemented/kmeans/logic.ts
import { AlgorithmBlueprint } from '../../base';
import { VisualizerState, Point, AlgorithmParam } from '../../../types';

// Define the custom metadata K-Means needs to track
interface KMeansMeta {
  centroids: Point[];
  phase: 'ASSIGNMENT' | 'UPDATE';
}

// A helper array of distinct colors for our clusters
const CLUSTER_COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

export const KMeansAlgorithm: AlgorithmBlueprint = {
  id: 'kmeans',
  name: "K-Means Clustering",
  shortDescription: "Iteratively groups data into K distinct clusters based on spatial distance.",
  category: "Clustering",
  
  metrics: {
    paradigm: 'Unsupervised',
    task: ['Clustering'],
    interpretability: 'High',
    trainingSpeed: 'High',
    inferenceSpeed: 'High',
    dataHunger: 'Low',
    requiresScaling: true,
    robustToOutliers: false,
    pros: ['Easy to understand and implement', 'Scales well to large datasets'],
    cons: ['Must specify K manually', 'Sensitive to initial centroid placement']
  },

  defaultParams: [
    { id: 'k', name: 'Clusters (K)', min: 2, max: 7, value: 3, step: 1 },
    { id: 'points', name: 'Data Points', min: 20, max: 200, value: 50, step: 10 }
  ],

  initialize: (width: number, height: number, params: AlgorithmParam[]): VisualizerState => {
    const k = params.find(p => p.id === 'k')?.value || 3;
    const numPoints = params.find(p => p.id === 'points')?.value || 50;

    // 1. Generate random data points (gray by default)
    const points: Point[] = Array.from({ length: numPoints }, () => ({
      x: Math.random() * (width - 40) + 20, // Add padding so points don't touch the edge
      y: Math.random() * (height - 40) + 20,
      color: '#475569' 
    }));

    // 2. Generate initial random centroids
    const centroids: Point[] = Array.from({ length: k }, (_, i) => ({
      x: Math.random() * (width - 40) + 20,
      y: Math.random() * (height - 40) + 20,
      label: `Centroid ${i}`,
      color: CLUSTER_COLORS[i % CLUSTER_COLORS.length]
    }));

    return {
      points,
      meta: { centroids, phase: 'ASSIGNMENT' } as KMeansMeta,
      currentStep: 0,
      explanation: `Initialized ${numPoints} random data points and placed ${k} cluster centroids.`,
      isCompleted: false
    };
  },

  nextStep: (currentState: VisualizerState, _params: AlgorithmParam[]): VisualizerState => {
    const { points, meta, currentStep } = currentState;
    const { centroids, phase } = meta as KMeansMeta;

    // --- PHASE 1: ASSIGNMENT ---
    if (phase === 'ASSIGNMENT') {
      const newPoints = points.map(point => {
        let minDistance = Infinity;
        let closestColor = point.color;

        centroids.forEach(centroid => {
          // Euclidean distance calculation
          const dist = Math.hypot(point.x - centroid.x, point.y - centroid.y);
          if (dist < minDistance) {
            minDistance = dist;
            closestColor = centroid.color;
          }
        });
        return { ...point, color: closestColor };
      });

      return {
        points: newPoints,
        meta: { centroids, phase: 'UPDATE' },
        currentStep: currentStep + 1,
        explanation: "Assignment Phase: Calculated distance from each point to all centroids. Points are colored to match their closest centroid.",
        isCompleted: false
      };
    } 
    
    // --- PHASE 2: UPDATE ---
    else {
      let hasConverged = true;
      
      const newCentroids = centroids.map(centroid => {
        const assignedPoints = points.filter(p => p.color === centroid.color);
        
        // If a centroid loses all points, leave it where it is
        if (assignedPoints.length === 0) return centroid;

        // Calculate the mean (center of mass) for X and Y
        const avgX = assignedPoints.reduce((sum, p) => sum + p.x, 0) / assignedPoints.length;
        const avgY = assignedPoints.reduce((sum, p) => sum + p.y, 0) / assignedPoints.length;

        // Check if the centroid actually moved (threshold of 0.1 pixels)
        if (Math.abs(centroid.x - avgX) > 0.1 || Math.abs(centroid.y - avgY) > 0.1) {
          hasConverged = false;
        }

        return { ...centroid, x: avgX, y: avgY };
      });

      return {
        points,
        meta: { centroids: newCentroids, phase: 'ASSIGNMENT' },
        currentStep: currentStep + 1,
        explanation: hasConverged 
          ? "Update Phase: Centroids did not move. Algorithm has converged!"
          : "Update Phase: Moved each centroid to the mean center of its assigned data points.",
        isCompleted: hasConverged
      };
    }
  }
};