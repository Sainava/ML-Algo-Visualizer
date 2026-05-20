// src/App.tsx
import { useRef, useEffect } from 'react';
import { VisualizerProvider, useVisualizer } from './context/VisualizerContext';
import { AlgorithmSelector } from './components/AlgorithmSelector.tsx';
import { MetricsPanel } from './components/MetricsPanel.tsx';
import { ControlPanel } from './components/ControlPanel.tsx';
import { AlgorithmRegistry } from './algorithms/registry';
import './App.css';

function App() {
  const VisualizerCanvas = () => {
    const { activeAlgoId, setCanvasSize, isTransitioning } = useVisualizer();
    const containerRef = useRef<HTMLDivElement | null>(null);
    const resizeTimer = useRef<number | null>(null);

    useEffect(() => {
      if (!containerRef.current) return;
      const el = containerRef.current;
      const handleResize = (width: number, height: number) => {
        // debounce rapid resize events
        if (resizeTimer.current) window.clearTimeout(resizeTimer.current);
        resizeTimer.current = window.setTimeout(() => {
          setCanvasSize(Math.max(200, Math.floor(width)), Math.max(150, Math.floor(height)));
          resizeTimer.current = null;
        }, 140);
      };

      const ro = new ResizeObserver(entries => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          handleResize(width, height);
        }
      });
      ro.observe(el);
      // initial sizing
      const r = el.getBoundingClientRect();
      handleResize(r.width, r.height);
      return () => {
        ro.disconnect();
        if (resizeTimer.current) window.clearTimeout(resizeTimer.current);
      };
    }, [containerRef, activeAlgoId]);

    const CanvasComponent = AlgorithmRegistry[activeAlgoId].canvasComponent;
    return (
      <div
        ref={containerRef}
        className={`canvas-frame transition-all duration-320 ${isTransitioning ? 'opacity-40 scale-[0.995]' : 'opacity-100 scale-100'}`}>
        <CanvasComponent />
      </div>
    );
  };
  return (
    <VisualizerProvider>
      <div className="app-shell">
        <div className="app-shell__glow app-shell__glow--a" />
        <div className="app-shell__glow app-shell__glow--b" />
        {/* CODERABBIT TEST: I am a contributor modifying the global shell! */}
        {/* CODERABBIT TEST: I am a contributor modifying the global shell! */}
        <div className="app-shell__frame">
          <aside className="panel panel--left">
            <div className="brand-block">
              <div className="brand-block__eyebrow">ML visualization suite</div>
              <h1 className="brand-block__title">AlgoScope</h1>
              <p className="brand-block__subtitle">Interactive learning engine for exploring algorithm behavior.</p>
            </div>

            <div className="panel__section panel__section--soft">
              <div className="panel__label">Algorithm library</div>
              <AlgorithmSelector />
            </div>
          </aside>

          <section className="panel panel--center">
            <header className="panel__header">
              <div>
                <div className="panel__eyebrow">Visualization workspace</div>
                <h2 className="panel__title">Execution Canvas</h2>
              </div>
              <div className="status-pill">Live simulation</div>
            </header>

            <main className="panel__canvas-shell">
              <VisualizerCanvas />
            </main>

            <footer className="panel__footer">
              <ControlPanel />
            </footer>
          </section>

          <aside className="panel panel--right">
            <div className="panel__section panel__section--tight">
              <div className="panel__label">Algorithm profile</div>
              <MetricsPanel />
            </div>
          </aside>
        </div>
      </div>
    </VisualizerProvider>
  );
}

export default App;