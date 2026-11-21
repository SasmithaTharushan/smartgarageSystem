import React, { useState, useEffect } from 'react';
import { CheckCircle2, Plus, Calendar, Gauge } from 'lucide-react';

const DEFAULT_VEHICLE = {
  make: 'Tesla',
  model: 'Model 3 / Daily Sedan',
  year: '2023',
  plate: 'WP-CAD-8921',
  odometer: 42350
};

const DEFAULT_TASKS = [
  { id: 1, title: 'Engine Oil & Filter Replacement', dueKm: 45000, dueDate: '2027-01-15', category: 'Powertrain' },
  { id: 2, title: 'Tire Rotation & Wheel Balancing', dueKm: 46000, dueDate: '2027-02-10', category: 'Tires' },
  { id: 3, title: 'Brake Fluid & Pad Inspection', dueKm: 50000, dueDate: '2027-04-01', category: 'Braking' },
  { id: 4, title: 'Annual Vehicle Insurance & Revenue License', dueKm: null, dueDate: '2027-02-28', category: 'Documentation' }
];

export const VehicleManager = () => {
  const [vehicle, setVehicle] = useState(() => {
    const saved = localStorage.getItem('garage_vehicle');
    return saved ? JSON.parse(saved) : DEFAULT_VEHICLE;
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('garage_tasks');
    return saved ? JSON.parse(saved) : DEFAULT_TASKS;
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDueKm, setNewDueKm] = useState('');
  const [newDueDate, setNewDueDate] = useState('');

  useEffect(() => {
    localStorage.setItem('garage_vehicle', JSON.stringify(vehicle));
  }, [vehicle]);

  useEffect(() => {
    localStorage.setItem('garage_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleUpdateOdo = (e) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      setVehicle((prev) => ({ ...prev, odometer: val }));
    }
  };

  const handleCompleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask = {
      id: Date.now(),
      title: newTitle.trim(),
      dueKm: newDueKm ? parseInt(newDueKm, 10) : null,
      dueDate: newDueDate || '2027-12-31',
      category: 'General'
    };

    setTasks((prev) => [...prev, newTask]);
    setNewTitle('');
    setNewDueKm('');
    setNewDueDate('');
    setShowAddModal(false);
  };

  return (
    <div className="vehicle-container">
      {/* Header Info */}
      <div className="vehicle-header-card">
        <div className="vehicle-details">
          <h2>{vehicle.year} {vehicle.make} {vehicle.model}</h2>
          <div className="vehicle-badge-row">
            <span className="vehicle-pill">Plate: {vehicle.plate}</span>
            <span className="vehicle-pill">Primary Vehicle</span>
          </div>
        </div>

        <div className="odometer-box">
          <div className="odometer-label">Current Odometer</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Gauge size={18} style={{ color: '#38bdf8' }} />
            <input
              type="number"
              value={vehicle.odometer}
              onChange={handleUpdateOdo}
              className="odometer-val"
              style={{
                background: 'transparent',
                border: 'none',
                width: '120px',
                textAlign: 'right',
                outline: 'none'
              }}
            />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>KM</span>
          </div>
        </div>
      </div>

      {/* Task List Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>
            Maintenance & Service Milestones
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Track service intervals, scheduled dates, and vehicle health
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="sim-action-btn"
          style={{ background: 'var(--primary)', color: '#fff', borderColor: 'var(--primary)' }}
        >
          <Plus size={14} /> Add Service Task
        </button>
      </div>

      {/* Tasks List */}
      <div className="service-tasks-list">
        {tasks.map((task) => {
          const kmRemaining = task.dueKm ? task.dueKm - vehicle.odometer : null;
          const isUrgent = kmRemaining !== null && kmRemaining <= 1500;

          return (
            <div key={task.id} className="service-task-card">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h4 className="task-title">{task.title}</h4>
                  <span className="badge-tag">{task.category}</span>
                </div>
                <div className="task-meta" style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                  {task.dueKm && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Gauge size={13} /> At {task.dueKm.toLocaleString()} km
                    </span>
                  )}
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={13} /> {task.dueDate}
                  </span>
                </div>
              </div>

              <div className="task-bottom">
                {kmRemaining !== null ? (
                  <span
                    className={`metric-status-badge ${isUrgent ? 'alert' : 'normal'}`}
                  >
                    {kmRemaining > 0 ? `${kmRemaining.toLocaleString()} km remaining` : 'Overdue!'}
                  </span>
                ) : (
                  <span className="metric-status-badge normal">Scheduled</span>
                )}

                <button
                  onClick={() => handleCompleteTask(task.id)}
                  className="btn-complete-task"
                  title="Mark Completed"
                >
                  <CheckCircle2 size={13} style={{ display: 'inline', marginRight: '4px' }} />
                  Done
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem'
        }}>
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            width: '100%',
            maxWidth: '420px',
            boxShadow: 'var(--shadow-card)'
          }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
              Add Service Milestone
            </h3>
            <form onSubmit={handleAddTask} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Task Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Brake Pad Replacement"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    background: '#070a10',
                    color: '#fff',
                    outline: 'none'
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Due at Odometer (KM, Optional)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 50000"
                  value={newDueKm}
                  onChange={(e) => setNewDueKm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    background: '#070a10',
                    color: '#fff',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Target Due Date
                </label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    background: '#070a10',
                    color: '#fff',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="sim-action-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="sim-action-btn"
                  style={{ background: 'var(--primary)', color: '#fff', borderColor: 'var(--primary)' }}
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
