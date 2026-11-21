import React from 'react';
import { ShieldCheck, ShieldAlert, Car, Fan, Lightbulb, Lock, Unlock } from 'lucide-react';

export const GarageVisualizer = ({ telemetry, onToggleDoor }) => {
  const isDoorOpen = String(telemetry.doorStatus).toUpperCase() === 'OPEN' || String(telemetry.doorStatus).toUpperCase() === 'ON';
  const isHazard = telemetry.smokeStatus === 'DANGER' || telemetry.coStatus === 'DANGER';
  const isMotion = Boolean(telemetry.motionDetected);

  return (
    <div className="visualizer-card">
      <div className="card-header-flex">
        <div>
          <h3 className="card-title">Garage Bay Controller</h3>
          <p className="card-subtitle">
            {isMotion ? 'Vehicle / Motion Active' : 'Bay Ready • Secure'}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {isHazard ? (
            <span className="metric-status-badge alert">
              <ShieldAlert size={12} /> HAZARD
            </span>
          ) : (
            <span className="metric-status-badge normal">
              <ShieldCheck size={12} /> SECURED
            </span>
          )}
        </div>
      </div>

      {/* Interactive Visual Stage */}
      <div className="garage-stage">
        {/* Animated Roll-up Shutter */}
        <div
          className="garage-door-shutter"
          style={{ height: isDoorOpen ? '18%' : '90%' }}
        >
          <div className="shutter-lines">
            <div className="shutter-line" />
            <div className="shutter-line" />
            <div className="shutter-line" />
            <div className="shutter-line" />
          </div>
        </div>

        {/* Vehicle graphic representation */}
        <div className={`vehicle-graphic ${isMotion ? 'present' : ''}`}>
          <Car size={96} strokeWidth={1.5} />
        </div>

        {/* Status badges inside stage */}
        <div className="stage-indicators">
          <div className={`stage-badge ${telemetry.fanStatus === 'ON' ? 'active' : ''}`}>
            <Fan size={14} className={telemetry.fanStatus === 'ON' ? 'animate-spin' : ''} />
            <span>Fan: {telemetry.fanStatus}</span>
          </div>

          <div className={`stage-badge ${telemetry.lightStatus === 'ON' ? 'active' : ''}`}>
            <Lightbulb size={14} />
            <span>Light: {telemetry.lightStatus}</span>
          </div>
        </div>
      </div>

      {/* Big Action Button */}
      <button
        onClick={onToggleDoor}
        className={`btn-door-toggle ${isDoorOpen ? 'open' : 'closed'}`}
      >
        {isDoorOpen ? (
          <>
            <Lock size={18} /> Close & Lock Garage Door
          </>
        ) : (
          <>
            <Unlock size={18} /> Open Garage Door
          </>
        )}
      </button>
    </div>
  );
};
