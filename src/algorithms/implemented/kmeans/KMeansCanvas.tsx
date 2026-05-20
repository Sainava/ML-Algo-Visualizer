// src/algorithms/implemented/kmeans/KMeansCanvas.tsx
import { useVisualizer } from '../../../context/VisualizerContext';

export const KMeansCanvas = () => {
  const { state } = useVisualizer();
  
  // We extract the custom metadata we defined in logic.ts
  const centroids = state.meta?.centroids || [];

  // adaptive radius: smaller when many points so everything remains visible
  const pointRadius = Math.max(2, 6 - Math.floor(state.points.length / 100));

  return (
    // viewBox allows the SVG to scale responsively without squishing
    <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid meet" className="w-full h-full absolute inset-0">
      
      {/* 1. Draw Data Points */}
      {state.points.map((point, i) => (
        <circle
          key={`point-${i}`}
          cx={point.x}
          cy={point.y}
          r={pointRadius}
          fill={point.color}
          className="transition-all duration-700 ease-in-out"
          style={{ opacity: point.color === '#475569' ? 0.6 : 1 }}
        />
      ))}

      {/* 2. Draw Centroids */}
      {centroids.map((centroid: any, i: number) => (
        <g
          key={`centroid-${i}`}
          transform={`translate(${centroid.x}, ${centroid.y})`}
          className="transition-all duration-700 ease-in-out"
        >
          <polygon points="0,-14 12,10 -12,10" fill={centroid.color} stroke="#ffffff" strokeWidth={2.5} />
          <circle r={Math.max(10, pointRadius * 3)} fill={centroid.color} opacity={0.18} />
        </g>
      ))}

      {/* 3. Overlay the Completion State if done */}
      {state.isCompleted && (
        <text 
          x="400" 
          y="250" 
          textAnchor="middle" 
          className="text-4xl font-bold fill-white opacity-20 pointer-events-none"
        >
          CONVERGED
        </text>
      )}
    </svg>
  );
};