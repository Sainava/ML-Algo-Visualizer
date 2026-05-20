// src/context/VisualizerContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { VisualizerState, AlgorithmParam } from '../types';
import { AlgorithmRegistry, AvailableAlgorithms } from '../algorithms/registry';

interface ContextType {
  activeAlgoId: AvailableAlgorithms;
  setActiveAlgoId: (id: AvailableAlgorithms) => void;
  switchAlgorithm: (id: AvailableAlgorithms) => void;
  
  // Educational & Config Data
  activeBlueprint: typeof AlgorithmRegistry[AvailableAlgorithms]['blueprint'];
  params: AlgorithmParam[];
  setParamValue: (id: string, val: number) => void;
  
  // Execution State
  state: VisualizerState;
  isPlaying: boolean;
  isTransitioning: boolean;
  speed: number;
  setSpeed: (s: number) => void;
  togglePlay: () => void;
  stepForward: () => void;
  reset: () => void;
  setCanvasSize: (w: number, h: number) => void;
}

const VisualizerContext = createContext<ContextType | null>(null);

export const VisualizerProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeAlgoId, setActiveAlgoId] = useState<AvailableAlgorithms>('kmeans');
  const activeBlueprint = AlgorithmRegistry[activeAlgoId].blueprint;
  
  const [params, setParams] = useState<AlgorithmParam[]>(activeBlueprint.defaultParams);
  const [speed, setSpeed] = useState(800);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [canvasSize, setCanvasSizeState] = useState<{ w: number; h: number }>({ w: 800, h: 500 });
  
  // The Canvas state. We initialize it based on the active blueprint.
  const [state, setState] = useState<VisualizerState>(() => 
    activeBlueprint.initialize(canvasSize.w, canvasSize.h, activeBlueprint.defaultParams)
  );

  // When the active algorithm changes, reset everything
  useEffect(() => {
    const newBlueprint = AlgorithmRegistry[activeAlgoId].blueprint;
    setParams(newBlueprint.defaultParams);
    setIsPlaying(false);
    setState(newBlueprint.initialize(canvasSize.w, canvasSize.h, newBlueprint.defaultParams));
  }, [activeAlgoId, canvasSize.w, canvasSize.h]);

  const switchAlgorithm = (id: AvailableAlgorithms) => {
    if (id === activeAlgoId) return;
    // trigger fade-out in canvas consumers
    setIsTransitioning(true);
    setIsPlaying(false);
    // small timeout to allow CSS fade-out (300ms)
    setTimeout(() => {
      setActiveAlgoId(id);
      // allow a short delay for new canvas to mount, then fade-in
      setTimeout(() => setIsTransitioning(false), 120);
    }, 320);
  };

  const reset = () => {
    setIsPlaying(false);
    setState(activeBlueprint.initialize(canvasSize.w, canvasSize.h, params));
  };

  const setCanvasSize = (w: number, h: number) => {
    setCanvasSizeState({ w, h });
    setState(activeBlueprint.initialize(w, h, params));
  };

  const setParamValue = (id: string, val: number) => {
    setParams(prev => prev.map(p => p.id === id ? { ...p, value: val } : p));
  };

  const stepForward = () => {
    setState(prevState => {
      if (prevState.isCompleted) {
        setIsPlaying(false);
        return prevState;
      }
      return activeBlueprint.nextStep(prevState, params);
    });
  };

  // The Playback Loop
  useEffect(() => {
    let interval: number;
    if (isPlaying && !state.isCompleted) {
      interval = setInterval(stepForward, speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, state.isCompleted, speed, activeBlueprint, params]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <VisualizerContext.Provider value={{
      activeAlgoId, setActiveAlgoId, switchAlgorithm, activeBlueprint,
      params, setParamValue, state,
      isPlaying, speed, setSpeed, togglePlay, stepForward, reset,
      setCanvasSize, isTransitioning
    }}>
      {children}
    </VisualizerContext.Provider>
  );
};

export const useVisualizer = () => {
  const context = useContext(VisualizerContext);
  if (!context) throw new Error("useVisualizer must be used within Provider");
  return context;
};