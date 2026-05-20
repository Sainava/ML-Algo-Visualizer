import { useVisualizer } from '../../../context/VisualizerContext';

interface LinearRegressionMeta {
  regressionLine: { slope: number; intercept: number };
  mse: number;
  showResiduals: boolean;
}

export const LinearRegressionCanvas = () => {
  const { state } = useVisualizer();
  const meta = state.meta as LinearRegressionMeta | undefined;
  
  const regressionLine = meta?.regressionLine || { slope: 0, intercept: 0 };
  const showResiduals = meta?.showResiduals || false;

  // Calculate line endpoints based on the canvas width
  const x1 = 0;
  const y1 = regressionLine.intercept;
  const x2 = 800;
  const y2 = regressionLine.slope * 800 + regressionLine.intercept;

  return (
    <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid meet" className="w-full h-full absolute inset-0">
      
      {/* 1. Definitions for styling */}
      <defs>
        <linearGradient id="lrGradient" x1="0" y1="0" x2="800" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>

      {/* 2. Draw Dynamic Residuals */}
      {showResiduals &&
        state.points.map((point, i) => {
          const predictedY = regressionLine.slope * point.x + regressionLine.intercept;
          return (
            <line
              key={`residual-${i}`}
              x1={point.x}
              y1={point.y}
              x2={point.x}
              y2={predictedY}
              stroke="#ef4444"
              strokeWidth={1.5}
              opacity={0.4}
              strokeDasharray="4,4"
              // Smooth transition as the line moves
              className="transition-all duration-300 ease-linear" 
            />
          );
        })}

      {/* 3. Draw The Learning Line */}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="url(#lrGradient)"
        strokeWidth={4}
        className="transition-all duration-300 ease-linear shadow-lg"
      />

      {/* 4. Draw Data Points on top of the line */}
      {state.points.map((point, i) => (
        <circle
          key={`point-${i}`}
          cx={point.x}
          cy={point.y}
          r={4}
          fill={point.color}
          className="transition-all duration-500 ease-in-out"
          stroke="#0f172a"
          strokeWidth={1}
        />
      ))}

      {/* 5. Live MSE Telemetry Overlay */}
      <g transform="translate(20, 40)">
        <rect x="0" y="-20" width="160" height="40" rx="6" fill="#1e293b" opacity="0.8" stroke="#334155" />
        <text x="15" y="4" fontSize="14" fill="#94a3b8" fontFamily="monospace">
          MSE: <tspan fill="#f87171" fontWeight="bold">{meta?.mse?.toFixed(0) || 0}</tspan>
        </text>
      </g>

      {/* 6. Completion State */}
      {state.isCompleted && (
        <g className="transition-opacity duration-1000 ease-in-out">
          <text x="400" y="450" textAnchor="middle" fontSize="32" fontWeight="bold" fill="#ffffff" opacity="0.1" pointerEvents="none">
            R² OPTIMIZED
          </text>
        </g>
      )}
    </svg>
  );
};