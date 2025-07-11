import { lazy, Suspense } from 'react';

// Lazy load heavy components
const MetricsOverview = lazy(() => import('../MetricsOverview'));
const MemoryChart = lazy(() => import('../charts/MemoryChart'));
const TopDevicesChart = lazy(() => import('../charts/TopDevicesChart'));
const AlertsTable = lazy(() => import('../tables/AlertsTable'));
const EventLogs = lazy(() => import('../tables/EventsTable'));
const DonutChart = lazy(() => import('../charts/DonutChart'));

const Dashboard = ({ isDarkMode }) => {
  const dashboardData = {
    totalDevices: 121,
    activeDevices: 70,
    inactiveDevices: 51,
    recentAlerts: 12,
    memoryUsage: [
      { time: '00:00', usage: 45 },
      { time: '04:00', usage: 52 },
      { time: '08:00', usage: 58 },
      { time: '12:00', usage: 65 },
      { time: '16:00', usage: 72 },
      { time: '20:00', usage: 78 },
      { time: '24:00', usage: 85 }
    ],
    topDevices: [
      { id: 'S_P1', value: 45 },
      { id: 'S_P2', value: 75 },
      { id: 'S_P3', value: 85 },
      { id: 'S_P4', value: 25 }
    ],
    alerts: [
      {
        time: '2025-06-24T10:30:12Z',
        component: 'CPU',
        severity: 'Warning',
        description: 'High CPU usage',
        device: 'WS-21'
      },
      {
        time: '2025-06-24T10:31:12Z',
        component: 'Memory',
        severity: 'Critical',
        description: 'Memory threshold crossed',
        device: 'DB-04'
      },
      {
        time: '2025-06-24T10:32:12Z',
        component: 'Storage',
        severity: 'Info',
        description: 'Disk check complete',
        device: 'SS-21'
      },
      {
        time: '2025-06-24T10:33:12Z',
        component: 'Network',
        severity: 'Warning',
        description: 'Network spike detected',
        device: 'WB-04'
      }
    ],
    eventLogs: [
      {
        time: '10m 16s ago',
        type: 'CONNECTION',
        component: 'WebSocket',
        description: 'WebSocket connection established'
      },
      {
        time: '10m 16s ago',
        type: 'MONITORING',
        component: 'Partition C:',
        description: 'Partition used space increased'
      },
      {
        time: '10m 16s ago',
        type: 'UPDATE',
        component: 'Partition C:',
        description: 'Partition used space increased'
      }
    ],
    deviceTypes: {
      Server: 35,
      VMS: 70,
      Physicals: 10,
      Laptop: 6
    }
  };

  return (
    <div className="space-y-6">
      <Suspense fallback={<div className="p-4 text-center">Loading dashboard overview...</div>}>
        <MetricsOverview data={dashboardData} isDarkMode={isDarkMode} />
      </Suspense>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Suspense fallback={<div className="p-4 text-center">Loading memory chart...</div>}>
          <MemoryChart usageData={dashboardData.memoryUsage} isDarkMode={isDarkMode} />
        </Suspense>
        <Suspense fallback={<div className="p-4 text-center">Loading top devices chart...</div>}>
          <TopDevicesChart devices={dashboardData.topDevices} isDarkMode={isDarkMode} />
        </Suspense>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Suspense fallback={<div className="p-4 text-center">Loading donut chart...</div>}>
          <DonutChart
            title="Device Status"
            activeCount={dashboardData.activeDevices}
            inactiveCount={dashboardData.inactiveDevices}
            isDarkMode={isDarkMode}
          />
        </Suspense>
        <Suspense fallback={<div className="p-4 text-center">Loading device type chart...</div>}>
          <DonutChart
            title="Device Types"
            deviceTypes={dashboardData.deviceTypes}
            isDarkMode={isDarkMode}
          />
        </Suspense>
        <Suspense fallback={<div className="p-4 text-center">Loading alerts...</div>}>
          <AlertsTable alerts={dashboardData.alerts} isDarkMode={isDarkMode} />
        </Suspense>
      </div>

      <Suspense fallback={<div className="p-4 text-center">Loading event logs...</div>}>
        <EventLogs eventLogs={dashboardData.eventLogs} isDarkMode={isDarkMode} />
      </Suspense>
    </div>
  );
};

export default Dashboard;
