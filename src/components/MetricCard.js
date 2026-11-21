import React from 'react';

export const MetricCard = ({ label, value, unit, status, statusType = 'normal', icon: Icon, extraInfo }) => {
  const isAlert = statusType === 'danger' || statusType === 'warning';

  return (
    <div className={`metric-card ${isAlert ? statusType : ''}`}>
      <div className="metric-top">
        <span className="metric-label">{label}</span>
        {Icon && (
          <div className="metric-icon-wrap">
            <Icon size={18} />
          </div>
        )}
      </div>

      <div>
        <div className="metric-value-row">
          <span className="metric-value">{value}</span>
          {unit && <span className="metric-unit">{unit}</span>}
        </div>

        {status && (
          <div className="flex items-center justify-between">
            <span className={`metric-status-badge ${isAlert ? 'alert' : 'normal'}`}>
              ● {status}
            </span>
            {extraInfo && (
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {extraInfo}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
