import { AlgorithmBlueprint } from '../../base';
import { VisualizerState, Point, AlgorithmParam } from '../../../types';

interface LinearRegressionMeta {
  regressionLine: { slope: number; intercept: number };
  targetLine: { slope: number; intercept: number }; // The true OLS answer
  mse: number;
  showResiduals: boolean;
}

export const LinearRegressionAlgorithm: AlgorithmBlueprint = {
  id: 'linear-regression',
  name: 'Linear Regression',
  shortDescription: 'Finds the best-fit line through data points by minimizing prediction errors.',
  category: 'Regression',

  metrics: {
    paradigm: 'Supervised',
    task: ['Regression'],
    interpretability: 'High',
    trainingSpeed: 'High',
    inferenceSpeed: 'High',
    dataHunger: 'Low',
    requiresScaling: true,
    robustToOutliers: false,
    pros: ['Simple and interpretable', 'Computationally efficient', 'Establishes baseline'],
    cons: ['Assumes linear relationship', 'Sensitive to outliers', 'Poor on complex data']
  },

  defaultParams: [
    { id: 'points', name: 'Data Points', min: 20, max: 100, value: 40, step: 5 },
    { id: 'noise', name: 'Noise Level', min: 0, max: 100, value: 30, step: 10 }
  ],

  initialize: (width: number, height: number, params: AlgorithmParam[]): VisualizerState => {
    const numPoints = params.find(p => p.id === 'points')?.value || 40;
    const noiseLevel = params.find(p => p.id === 'noise')?.value || 30;

    // 1. Generate Data (Fixed for SVG Coordinates to show positive correlation)
    const points: Point[] = Array.from({ length: numPoints }, () => {
      const x = Math.random() * (width - 80) + 40;
      // Negative slope in math = visually upward line in SVG
      const y = -0.4 * x + (height - 50) + (Math.random() - 0.5) * noiseLevel * 3;
      return {
        x: Math.max(40, Math.min(width - 40, x)),
        y: Math.max(40, Math.min(height - 40, y)),
        color: '#94a3b8'
      };
    });

    // 2. Calculate the True Target (OLS)
    const n = points.length;
    const sumX = points.reduce((sum, p) => sum + p.x, 0);
    const sumY = points.reduce((sum, p) => sum + p.y, 0);
    const sumXY = points.reduce((sum, p) => sum + p.x * p.y, 0);
    const sumX2 = points.reduce((sum, p) => sum + p.x * p.x, 0);

    const targetSlope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const targetIntercept = (sumY - targetSlope * sumX) / n;

    // 3. Start the line flat in the middle of the screen
    const initialLine = { slope: 0, intercept: height / 2 };
    
    // Calculate initial MSE
    const initialMse = points.reduce((err, p) => {
      const pred = initialLine.slope * p.x + initialLine.intercept;
      return err + Math.pow(p.y - pred, 2);
    }, 0) / n;

    return {
      points,
      meta: {
        regressionLine: initialLine,
        targetLine: { slope: targetSlope, intercept: targetIntercept },
        mse: initialMse,
        showResiduals: true
      } as LinearRegressionMeta,
      currentStep: 0,
      explanation: `Initialized flat baseline. Initial Mean Squared Error (MSE): ${initialMse.toFixed(0)}`,
      isCompleted: false
    };
  },

  nextStep: (currentState: VisualizerState): VisualizerState => {
    const { points, meta, currentStep } = currentState;
    const { regressionLine, targetLine } = meta as LinearRegressionMeta;

    // Interpolate 15% closer to the target line each step (Simulates learning rate)
    const newSlope = regressionLine.slope + (targetLine.slope - regressionLine.slope) * 0.15;
    const newIntercept = regressionLine.intercept + (targetLine.intercept - regressionLine.intercept) * 0.15;

    // Calculate new MSE
    const newMse = points.reduce((err, p) => {
      const pred = newSlope * p.x + newIntercept;
      return err + Math.pow(p.y - pred, 2);
    }, 0) / points.length;

    // Check for convergence (If the line is virtually exactly on the target)
    const isConverged = Math.abs(newSlope - targetLine.slope) < 0.001;

    return {
      points,
      meta: {
        regressionLine: isConverged ? targetLine : { slope: newSlope, intercept: newIntercept },
        targetLine,
        mse: newMse,
        showResiduals: true
      } as LinearRegressionMeta,
      currentStep: currentStep + 1,
      explanation: isConverged 
        ? `Model converged! Final MSE: ${newMse.toFixed(2)}. The line of best fit has been established.`
        : `Adjusting weights to minimize error. Current MSE: ${newMse.toFixed(2)}`,
      isCompleted: isConverged
    };
  }
};