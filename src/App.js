import React, { useState, useEffect } from 'react';
import { db, ref, onValue, set } from './firebase';
import './style.css';
import { MetricCard } from './components/MetricCard';
import { GarageVisualizer } from './components/GarageVisualizer';
import { SimulationBar } from './components/SimulationBar';
import { VehicleManager } from './components/VehicleManager';
import { AuditLog } from './components/AuditLog';
import {
  Flame,
  Wind,
  Thermometer,
  Droplets,
  Radio,
  Eye,
  Fan,
  Lightbulb,
  Zap,
  Activity,
  AlertTriangle,
  Car,
  Shield,
  SlidersHorizontal
} from 'lucide-react';

const INITIAL_LOGS = [
  { id: 1, time: 'Just now', event: 'System Check', uid: 'SYSTEM_DAEMON', source: 'Internal Monitor', status: 'SUCCESS' },
  { id: 2, time: '12 mins ago', event: 'RFID Access Granted', uid: 'E4:90:A1:2C', source: 'RC522 Gate Sensor', status: 'ALLOWED' },
  { id: 3, time: '1 hour ago', event: 'Exhaust Cycle Complete', uid: 'RELAY_FAN_01', source: 'Automation Rule', status: 'NORMAL' },
  { id: 4, time: '3 hours ago', event: 'Motion Detected', uid: 'PIR_SENSOR_01', source: 'Perimeter Sensor', status: 'SUCCESS' }
];

const App = () => {
  // Mode: 'simulation' (default for portfolio visitors) or 'live' (physical hardware)
  const [mode, setMode] = useState('simulation');
  const [activeTab, setActiveTab] = useState('dashboard');

  // Telemetry States
  const [gasLevel, setGasLevel] = useState(115);
  const [gasStatus, setGasStatus] = useState('Normal');
  const [humidity, setHumidity] = useState('54%');
  const [temperature, setTemperature] = useState('25.8°C');
  const [door, setDoor] = useState('CLOSED');
  const [mq7, setMQ7] = useState(12);
  const [mq7status, setMQ7Status] = useState('Normal');
  const [fan, setFan] = useState('OFF');
  const [light, setLight] = useState('OFF');
  const [pir, setPir] = useState('Inactive');
  const [rfidid, setRfidid] = useState('E4:90:A1:2C');
  const [rfidstatus, setRfidstatus] = useState('Authorized');
  const [pump, setPump] = useState('OFF');
  const [waterlevelstatus, setWaterLevelStatus] = useState('18 cm');
  const [servoState, setServoState] = useState('LOCKED');

  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [bannerAlert, setBannerAlert] = useState(null);

  // Sync with Firebase when in LIVE mode
  useEffect(() => {
    if (mode !== 'live' || !db) return;

    const unsubs = [];

    try {
      const gasLevelRef = ref(db, 'GasSensorMQ2/GasLevel');
      const gasStatusRef = ref(db, 'GasSensorMQ2/GasStatus');
      const humidityRef = ref(db, 'DHT11/Humidity');
      const temperatureRef = ref(db, 'DHT11/Temperature');
      const doorRef = ref(db, 'Door/DoorStatus');
      const mq7Ref = ref(db, 'GasSensorMQ7/GasLevel');
      const mq7statusRef = ref(db, 'GasSensorMQ7/GasStatus');
      const pirRef = ref(db, 'MotionSensor/MotionDetected');
      const fanRef = ref(db, 'Fan/FanStatus');
      const pumpRef = ref(db, 'WaterPump/RelayStatus');
      const lightRef = ref(db, 'Lights/LightStatus');
      const rfididRef = ref(db, 'RFID/CardUID');
      const waterlevelRef = ref(db, 'WaterLevelSensor/Value');
      const rfidstatusRef = ref(db, 'RFID/AccessStatus');
      const servoRef = ref(db, 'GarageServo/ServoStatus');

      unsubs.push(onValue(gasLevelRef, (s) => setGasLevel(s.val() ?? '--')));
      unsubs.push(onValue(gasStatusRef, (s) => setGasStatus(s.val() ?? '--')));
      unsubs.push(onValue(humidityRef, (s) => setHumidity(s.val() ?? '--')));
      unsubs.push(onValue(temperatureRef, (s) => setTemperature(s.val() ?? '--')));
      unsubs.push(onValue(doorRef, (s) => setDoor(s.val() ?? 'CLOSED')));
      unsubs.push(onValue(mq7Ref, (s) => setMQ7(s.val() ?? '--')));
      unsubs.push(onValue(mq7statusRef, (s) => setMQ7Status(s.val() ?? '--')));
      unsubs.push(onValue(pirRef, (s) => setPir(s.val() ?? 'Inactive')));
      unsubs.push(onValue(fanRef, (s) => setFan(s.val() ?? 'OFF')));
      unsubs.push(onValue(pumpRef, (s) => setPump(s.val() ?? 'OFF')));
      unsubs.push(onValue(lightRef, (s) => setLight(s.val() ?? 'OFF')));
      unsubs.push(onValue(rfididRef, (s) => setRfidid(s.val() ?? '--')));
      unsubs.push(onValue(waterlevelRef, (s) => setWaterLevelStatus(s.val() ?? '--')));
      unsubs.push(onValue(rfidstatusRef, (s) => setRfidstatus(s.val() ?? '--')));
      unsubs.push(onValue(servoRef, (s) => setServoState(s.val() ?? 'LOCKED')));
    } catch (err) {
      console.warn('Firebase listeners error:', err);
    }

    return () => {
      unsubs.forEach((unsub) => typeof unsub === 'function' && unsub());
    };
  }, [mode]);

  // Push new event to audit log
  const addLog = (event, uid, source, status) => {
    const newEntry = {
      id: Date.now(),
      time: new Date().toLocaleTimeString(),
      event,
      uid,
      source,
      status
    };
    setLogs((prev) => [newEntry, ...prev.slice(0, 19)]);
  };

  // Door Toggle Handler
  const toggleDoor = () => {
    const isCurrentlyOpen = String(door).toUpperCase() === 'OPEN' || String(servoState).toUpperCase() === 'UNLOCKED';
    const nextDoorState = isCurrentlyOpen ? 'CLOSED' : 'OPEN';
    const nextServoState = isCurrentlyOpen ? 'LOCKED' : 'UNLOCKED';

    setDoor(nextDoorState);
    setServoState(nextServoState);

    addLog(
      nextDoorState === 'OPEN' ? 'Garage Door Opened' : 'Garage Door Closed & Locked',
      rfidid || 'REMOTE_APP',
      'Dashboard Web App',
      'SUCCESS'
    );

    if (mode === 'live' && db) {
      set(ref(db, 'Door/DoorStatus'), nextDoorState);
      set(ref(db, 'GarageServo/ServoStatus'), nextServoState);
    }
  };

  // Toggle Actuator
  const toggleActuator = (actuator) => {
    if (actuator === 'fan') {
      const next = fan === 'ON' ? 'OFF' : 'ON';
      setFan(next);
      addLog(`Exhaust Fan turned ${next}`, 'MANUAL_OVERRIDE', 'Web Dashboard', 'NORMAL');
      if (mode === 'live' && db) set(ref(db, 'Fan/FanStatus'), next);
    } else if (actuator === 'light') {
      const next = light === 'ON' ? 'OFF' : 'ON';
      setLight(next);
      addLog(`Perimeter Light turned ${next}`, 'MANUAL_OVERRIDE', 'Web Dashboard', 'NORMAL');
      if (mode === 'live' && db) set(ref(db, 'Lights/LightStatus'), next);
    } else if (actuator === 'pump') {
      const next = pump === 'ON' ? 'OFF' : 'ON';
      setPump(next);
      addLog(`Sump Pump turned ${next}`, 'MANUAL_OVERRIDE', 'Web Dashboard', 'NORMAL');
      if (mode === 'live' && db) set(ref(db, 'WaterPump/RelayStatus'), next);
    }
  };

  // Trigger Simulated Sandbox Events
  const handleTriggerEvent = (eventType) => {
    if (eventType === 'CAR_ARRIVE') {
      setPir('Motion Detected');
      setLight('ON');
      setDoor('OPEN');
      setServoState('UNLOCKED');
      setBannerAlert(null);
      addLog('Vehicle Arrival Detected by PIR Sensor', 'PIR_AUTO', 'Perimeter Sensor', 'ALLOWED');
    } else if (eventType === 'SMOKE_LEAK') {
      setGasLevel(685);
      setGasStatus('DANGER');
      setFan('ON'); // Auto interlock
      setBannerAlert({
        title: 'CRITICAL SMOKE LEAK DETECTED (MQ-2)',
        desc: 'Exhaust fan activated automatically for safety. Garage bay ventilated.'
      });
      addLog('Smoke Level Critical: 685 ppm', 'MQ2_SENSOR', 'Emergency System', 'ALERT');
    } else if (eventType === 'CO_SPIKE') {
      setMQ7(182);
      setMQ7Status('CRITICAL');
      setFan('ON');
      setBannerAlert({
        title: 'CARBON MONOXIDE (CO) ALERT (MQ-7)',
        desc: 'Dangerous CO concentration. Ventilation forced ON.'
      });
      addLog('CO Spike Detected: 182 ppm', 'MQ7_SENSOR', 'Emergency System', 'ALERT');
    } else if (eventType === 'WATER_RISE') {
      setWaterLevelStatus('88 cm (High)');
      setPump('ON');
      setBannerAlert({
        title: 'WATER SUMP LEVEL WARNING',
        desc: 'Water level reached threshold. Automatic sump pump drainage started.'
      });
      addLog('Water Level Exceeded Safe Threshold', 'WATER_PROBE', 'Sump Controller', 'ALERT');
    } else if (eventType === 'RESET') {
      setGasLevel(115);
      setGasStatus('Normal');
      setMQ7(12);
      setMQ7Status('Normal');
      setPir('Inactive');
      setFan('OFF');
      setLight('OFF');
      setPump('OFF');
      setDoor('CLOSED');
      setServoState('LOCKED');
      setWaterLevelStatus('18 cm');
      setBannerAlert(null);
      addLog('Telemetry Reset to Factory Safe Values', 'ADMIN_SIM', 'Demo Sandbox', 'NORMAL');
    }
  };

  return (
    <div className="app-container">
      {/* App Header */}
      <header className="app-header">
        <div className="brand-section">
          <div className="brand-icon">
            <Car size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <h1 className="brand-title">GarageOS</h1>
              <span className="badge-version">v2.0</span>
            </div>
            <p className="brand-subtitle">Smart Garage Automation & Vehicle Telemetry Hub</p>
          </div>
        </div>

        <div className="header-controls">
          {/* Mode Switcher */}
          <div className="mode-toggle">
            <button
              onClick={() => setMode('simulation')}
              className={`mode-btn ${mode === 'simulation' ? 'active' : ''}`}
            >
              <SlidersHorizontal size={14} /> Interactive Sandbox
            </button>
            <button
              onClick={() => setMode('live')}
              className={`mode-btn ${mode === 'live' ? 'active' : ''}`}
            >
              <Radio size={14} /> Live Firebase
            </button>
          </div>

          <div className="status-pill">
            <span className="status-dot" />
            <span>{mode === 'simulation' ? 'Demo Sandbox Active' : 'IoT Hardware Connected'}</span>
          </div>
        </div>
      </header>

      {/* Critical Alert Banner */}
      {bannerAlert && (
        <div className="alert-banner">
          <div className="alert-content">
            <AlertTriangle size={20} />
            <div>
              <strong>{bannerAlert.title}: </strong>
              <span>{bannerAlert.desc}</span>
            </div>
          </div>
          <button
            onClick={() => setBannerAlert(null)}
            className="sim-action-btn"
            style={{ borderColor: 'rgba(239, 68, 68, 0.5)' }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <nav className="tabs-nav">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
        >
          <Activity size={16} /> Garage Bay & Telemetry
        </button>
        <button
          onClick={() => setActiveTab('vehicles')}
          className={`tab-btn ${activeTab === 'vehicles' ? 'active' : ''}`}
        >
          <Car size={16} /> Vehicle Maintenance Ledger
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
        >
          <Shield size={16} /> Access & Security Logs
        </button>
      </nav>

      {/* TAB 1: GARAGE DASHBOARD */}
      {activeTab === 'dashboard' && (
        <>
          {/* Sandbox Control Strip */}
          <SimulationBar onTriggerEvent={handleTriggerEvent} />

          {/* Main Dashboard Grid */}
          <div className="dashboard-grid">
            {/* Visual Garage Controller */}
            <GarageVisualizer
              telemetry={{
                doorStatus: door,
                servoState,
                smokeStatus: gasStatus,
                coStatus: mq7status,
                motionDetected: pir === 'Motion Detected' || pir === true || pir === 1,
                fanStatus: fan,
                lightStatus: light
              }}
              onToggleDoor={toggleDoor}
            />

            {/* Environmental & Safety Telemetry Cards */}
            <div className="telemetry-grid">
              <MetricCard
                label="Smoke Level (MQ-2)"
                value={gasLevel}
                unit="ppm"
                status={gasStatus}
                statusType={String(gasStatus).toUpperCase() === 'DANGER' ? 'danger' : 'normal'}
                icon={Flame}
                extraInfo="Fire Safety"
              />

              <MetricCard
                label="CO Gas Level (MQ-7)"
                value={mq7}
                unit="ppm"
                status={mq7status}
                statusType={String(mq7status).toUpperCase() === 'CRITICAL' ? 'danger' : 'normal'}
                icon={Wind}
                extraInfo="Toxic Gas Monitor"
              />

              <MetricCard
                label="Ambient Temperature"
                value={temperature}
                status="DHT11 Sensor"
                statusType="normal"
                icon={Thermometer}
                extraInfo="Climate Zone"
              />

              <MetricCard
                label="Garage Humidity"
                value={humidity}
                status="Optimal"
                statusType="normal"
                icon={Droplets}
                extraInfo="Moisture Check"
              />

              <MetricCard
                label="Sump Water Level"
                value={waterlevelstatus}
                status={pump === 'ON' ? 'Drain Pump Active' : 'Normal Basin'}
                statusType={pump === 'ON' ? 'warning' : 'normal'}
                icon={Droplets}
                extraInfo="Flood Prevention"
              />

              <MetricCard
                label="Perimeter Motion (PIR)"
                value={pir}
                status={pir === 'Motion Detected' ? 'Vehicle / Person' : 'Clear Zone'}
                statusType={pir === 'Motion Detected' ? 'warning' : 'normal'}
                icon={Eye}
                extraInfo="Motion Tracker"
              />

              <MetricCard
                label="RFID Gate Status"
                value={rfidstatus}
                status={`UID: ${rfidid}`}
                statusType={String(rfidstatus).toUpperCase() === 'DENIED' ? 'danger' : 'normal'}
                icon={Radio}
                extraInfo="Keyless Access"
              />

              <MetricCard
                label="Servo Lock Status"
                value={servoState}
                status={servoState === 'LOCKED' ? 'Securely Latched' : 'Door Unlocked'}
                statusType="normal"
                icon={Shield}
                extraInfo="Hardware Interlock"
              />
            </div>
          </div>

          {/* Quick Actuator Switches Strip */}
          <div className="actuators-section">
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
                Hardware Actuators & Relays
              </h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Directly toggle garage ventilation, safety lighting, and sump drainage
              </p>
            </div>

            <div className="actuator-switches">
              <div className="actuator-item">
                <button
                  onClick={() => toggleActuator('fan')}
                  className={`toggle-switch-btn ${fan === 'ON' ? 'active' : ''}`}
                >
                  <Fan size={14} className={fan === 'ON' ? 'animate-spin' : ''} />
                  Exhaust Fan: {fan}
                </button>
              </div>

              <div className="actuator-item">
                <button
                  onClick={() => toggleActuator('light')}
                  className={`toggle-switch-btn ${light === 'ON' ? 'active' : ''}`}
                >
                  <Lightbulb size={14} />
                  Security Light: {light}
                </button>
              </div>

              <div className="actuator-item">
                <button
                  onClick={() => toggleActuator('pump')}
                  className={`toggle-switch-btn ${pump === 'ON' ? 'active' : ''}`}
                >
                  <Zap size={14} />
                  Water Sump Pump: {pump}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* TAB 2: VEHICLE MAINTENANCE TRACKER */}
      {activeTab === 'vehicles' && <VehicleManager />}

      {/* TAB 3: AUDIT & SECURITY LOGS */}
      {activeTab === 'security' && <AuditLog logs={logs} />}

      {/* Footer */}
      <footer className="app-footer">
        <p>
          <strong>GarageOS</strong> • Open-Source Smart Garage & Vehicle Telemetry System by{' '}
          <a
            href="https://github.com/SasmithaTharushan"
            target="_blank"
            rel="noreferrer"
            className="footer-link"
          >
            Sasmitha Tharushan
          </a>
        </p>
      </footer>
    </div>
  );
};

export default App;
