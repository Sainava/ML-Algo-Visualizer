// src/components/ControlPanel.tsx
import { Play, Pause, SkipForward, RotateCcw, Download } from 'lucide-react';
import { useVisualizer } from '../context/VisualizerContext';

export const ControlPanel = () => {
  const { isPlaying, togglePlay, stepForward, reset, state } = useVisualizer();

  const download = (dataUrl: string, filename: string) => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };
  // This is a dummy comment to verify CodeRabbit catches component edits
  const exportSVG = () => {
    const svg = document.querySelector('.canvas-frame svg') as SVGElement | null;
    if (!svg) return alert('Canvas not ready');
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svg);
    // Add XML declaration
    if (!source.match(/^<\?xml/)) source = '<?xml version="1.0" standalone="no"?>\n' + source;
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    download(url, 'canvas.svg');
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  };

  const exportPNG = () => {
    const svg = document.querySelector('.canvas-frame svg') as SVGSVGElement | null;
    if (!svg) return alert('Canvas not ready');
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    const img = new Image();
    const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    img.onload = () => {
      const rect = svg.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.drawImage(img, 0, 0, rect.width, rect.height);
      const png = canvas.toDataURL('image/png');
      download(png, 'canvas.png');
      URL.revokeObjectURL(url);
    };
    img.onerror = () => { URL.revokeObjectURL(url); alert('Failed to render PNG'); };
    img.src = url;
  };

  return (
    <div className="control-panel">
      <div className="control-panel__playback">
        <button
          onClick={reset}
          className="control-button control-button--icon"
          title="Reset"
        >
          <RotateCcw size={20} />
        </button>

        <button
          onClick={togglePlay}
          disabled={state.isCompleted}
          className="play-button"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
        </button>

        <button
          onClick={stepForward}
          disabled={isPlaying || state.isCompleted}
          className="control-button control-button--icon"
          title="Step"
        >
          <SkipForward size={20} />
        </button>
      </div>

      <div className="control-panel__exports">
        <button onClick={exportPNG} className="export-button export-button--png" title="Export canvas as PNG">
          <Download size={16} /> PNG
        </button>

        <button onClick={exportSVG} className="export-button export-button--svg" title="Export canvas as SVG">
          <Download size={16} /> SVG
        </button>
      </div>
    </div>
  );
};