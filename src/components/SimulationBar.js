import React from 'react';
import { Flame, Car, Wind, Droplets, RefreshCw } from 'lucide-react';

export const SimulationBar = ({ onTriggerEvent }) => {
  return (
    <div className="simulation-bar">
      <div className="sim-info">
        <div>
          <h4>Interactive Demo Sandbox</h4>
          <p>Test real-time sensor reactions & safety automations without hardware</p>
        </div>
      </div>

      <div className="sim-buttons">
        <button
          className="sim-action-btn"
          onClick={() => onTriggerEvent('CAR_ARRIVE')}
        >
          <Car size={14} /> Car Pulls In (PIR)
        </button>

        <button
          className="sim-action-btn danger"
          onClick={() => onTriggerEvent('SMOKE_LEAK')}
        >
          <Flame size={14} /> Smoke Leak (MQ-2)
        </button>

        <button
          className="sim-action-btn danger"
          onClick={() => onTriggerEvent('CO_SPIKE')}
        >
          <Wind size={14} /> CO Spike (MQ-7)
        </button>

        <button
          className="sim-action-btn"
          onClick={() => onTriggerEvent('WATER_RISE')}
        >
          <Droplets size={14} /> Sump Level Rise
        </button>

        <button
          className="sim-action-btn"
          onClick={() => onTriggerEvent('RESET')}
        >
          <RefreshCw size={14} /> Reset Normal
        </button>
      </div>
    </div>
  );
};
