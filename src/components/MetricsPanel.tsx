// src/components/MetricsPanel.tsx
import { useVisualizer } from '../context/VisualizerContext';
import { Activity, Sliders, CheckCircle2, XCircle } from 'lucide-react';

export const MetricsPanel = () => {
  const { activeBlueprint, params, setParamValue } = useVisualizer();
  const { metrics } = activeBlueprint;

  const LevelBar = ({ level, label }: { level: string; label: string }) => {
    const fillClasses = {
      High: 'level-bar__fill level-bar__fill--high',
      Medium: 'level-bar__fill level-bar__fill--medium',
      Low: 'level-bar__fill level-bar__fill--low',
    };

    return (
      <div className="level-bar">
        <div className="level-bar__label">
          <span>{label}</span>
          <span className="level-bar__value">{level}</span>
        </div>
        <div className="level-bar__track">
          <div className={fillClasses[level as keyof typeof fillClasses]} />
        </div>
      </div>
    );
  };

  return (
    <div className="metrics-panel">
      <div className="metrics-panel__config">
        <h2 className="metrics-panel__title">
          <Sliders size={14} className="text-teal-400" /> Configuration
        </h2>

        <div className="metrics-panel__params">
          {params.map((param) => (
            <div key={param.id} className="param-control">
              <div className="param-control__header">
                <span className="param-control__name">{param.name}</span>
                <span className="param-control__value">{param.value}</span>
              </div>
              <input
                type="range"
                min={param.min}
                max={param.max}
                step={param.step}
                value={param.value}
                onChange={(e) => setParamValue(param.id, Number(e.target.value))}
                className="param-control__slider"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="metrics-panel__profile">
        <h2 className="metrics-panel__title">
          <Activity size={14} className="text-emerald-400" /> Algorithm Profile
        </h2>

        <div className="profile-highlights">
          <div className="profile-highlights__paradigm">{metrics.paradigm}</div>
          <div className="profile-highlights__task">{metrics.task.join(', ')}</div>

          <div className="profile-highlights__traits">
            <span className="profile-trait profile-trait--high">{metrics.interpretability}</span>
            <span className="profile-trait profile-trait--speed">{metrics.trainingSpeed}</span>
            <span className="profile-trait profile-trait--hunger">{metrics.dataHunger}</span>
          </div>

          <div className="profile-highlights__checks">
            <div className="profile-check">
              {metrics.requiresScaling ? (
                <XCircle size={14} className="profile-check__icon profile-check__icon--warning" />
              ) : (
                <CheckCircle2 size={14} className="profile-check__icon profile-check__icon--success" />
              )}
              <span>{metrics.requiresScaling ? 'Requires Feature Scaling' : 'Scale-Invariant'}</span>
            </div>
            <div className="profile-check">
              {metrics.robustToOutliers ? (
                <CheckCircle2 size={14} className="profile-check__icon profile-check__icon--success" />
              ) : (
                <XCircle size={14} className="profile-check__icon profile-check__icon--warning" />
              )}
              <span>{metrics.robustToOutliers ? 'Robust to Outliers' : 'Sensitive to Outliers'}</span>
            </div>
          </div>
        </div>

        <div className="profile-bars">
          <LevelBar label="Interpretability" level={metrics.interpretability} />
          <LevelBar label="Training Speed" level={metrics.trainingSpeed} />
          <LevelBar label="Data Hunger" level={metrics.dataHunger} />
        </div>
      </div>
    </div>
  );
};