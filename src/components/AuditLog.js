import React from 'react';
import { History } from 'lucide-react';

export const AuditLog = ({ logs }) => {
  return (
    <div className="audit-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
        <History size={18} style={{ color: 'var(--accent)' }} />
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>
          Access Control & System Security Log
        </h3>
      </div>

      <table className="audit-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Event</th>
            <th>Identifier / Card UID</th>
            <th>Triggered By</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{log.time}</td>
              <td style={{ fontWeight: 600 }}>{log.event}</td>
              <td>
                <span className="badge-tag">{log.uid}</span>
              </td>
              <td style={{ color: 'var(--text-muted)' }}>{log.source}</td>
              <td>
                <span
                  className={`metric-status-badge ${
                    log.status === 'ALLOWED' || log.status === 'NORMAL' || log.status === 'SUCCESS'
                      ? 'normal'
                      : 'alert'
                  }`}
                >
                  {log.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
