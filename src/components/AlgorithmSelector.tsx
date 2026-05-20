// src/components/AlgorithmSelector.tsx
import { useVisualizer } from '../context/VisualizerContext';
import { AlgorithmRegistry, AvailableAlgorithms } from '../algorithms/registry';

export const AlgorithmSelector = () => {
  const { activeAlgoId, switchAlgorithm } = useVisualizer();

  return (
    <div className="space-y-2.5">
      <div className="text-xs text-slate-500 mb-4 font-mono tracking-wider opacity-75">{">_ select_algorithm()"}</div>

      {Object.entries(AlgorithmRegistry).map(([id, data]) => {
        const isActive = activeAlgoId === id;

        return (
          <button
            key={id}
            onClick={() => switchAlgorithm(id as AvailableAlgorithms)}
            className={`algo-button ${
              isActive
                ? 'algo-button--active'
                : 'algo-button--inactive'
            }`}
          >
            <div
              className={`algo-button__indicator ${
                isActive ? 'algo-button__indicator--active' : ''
              }`}
            />
            <span className="algo-button__label">{data.blueprint.name}</span>
          </button>
        );
      })}
    </div>
  );
};