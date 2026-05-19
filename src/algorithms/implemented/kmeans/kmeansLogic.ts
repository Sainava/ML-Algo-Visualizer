import { AlgorithmBlueprint } from '../../base';
import { VisualizerState, Point } from '../../../types';

interface KMeansMeta {
  centroids: Point[];
  phase: 'ASSIGNMENT' | 'UPDATE';
}

export const KMeansAlgorithm: AlgorithmBlueprint = {
  name: "K-Means Clustering",
  description: "Groups data points into K distinct clusters based on distance.",

  initialize: (width, height): VisualizerState => {
    // 1. Generate random data points
    const points: Point[] = Array.from({ length: 40 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      color: '#94a3b8' // Default gray
    }));

    // 2. Generate 3 initial random centroids
    const centroids: Point[] = Array.from({ length: 3 }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      label: `centroid-${i}`,
      color: i === 0 ? '#ef4444' : i === 1 ? '#3b82f6' : '#22c55e' // Red, Blue, Green
    }));

    return {
      points,
      meta: { centroids, phase: 'ASSIGNMENT' } as KMeansMeta,
      currentStep: 0,
      explanation: "Initialized data points and 3 random cluster centroids.",
      isCompleted: false
    };
  },

  nextStep: (currentState: VisualizerState): VisualizerState => {
    const { points, meta, currentStep } = currentState;
    const { centroids, phase } = meta as KMeansMeta;

    if (phase === 'ASSIGNMENT') {
      // Step A: Assign each point to the closest centroid
      const newPoints = points.map(point => {
        let minDistance = Infinity;
        let closestColor = point.color;

        centroids.forEach(centroid => {
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
        explanation: "Assignment Phase: Each point is color-coded to its nearest cluster centroid.",
        isCompleted: false
      };
    } else {
      // Step B: Move centroids to the average of their assigned points
      let changed = false;
      const newCentroids = centroids.map(centroid => {
        const assignedPoints = points.filter(p => p.color === centroid.color);
        if (assignedPoints.length === 0) return centroid;

        const avgX = assignedPoints.reduce((sum, p) => sum + p.x, 0) / assignedPoints.length;
        const avgY = assignedPoints.reduce((sum, p) => sum + p.y, 0) / assignedPoints.length;

        // Check if centroids are still moving
        if (Math.abs(centroid.x - avgX) > 1 || Math.abs(centroid.y - avgY) > 1) {
          changed = true;
        }

        return { ...centroid, x: avgX, y: avgY };
      });

      return {
        points,
        meta: { centroids: newCentroids, phase: 'ASSIGNMENT' },
        currentStep: currentStep + 1,
        explanation: "Update Phase: Moved each centroid to the center of mass of its assigned points.",
        isCompleted: !changed // If no centroids moved, the algorithm has converged!
      };
    }
  }
};