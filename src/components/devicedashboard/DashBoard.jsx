

import {SystemInfoCard} from '../devicedashboard/SystemInfoCard';
import {CPUCard} from '../devicedashboard/CPUCard';
import {MemoryCard} from '../devicedashboard/MemoryCard';
import {NetworkCard} from '../devicedashboard/NetworkCard';
import {DiskUsageCard} from '../devicedashboard/DiskCard';
import {AlertsCard} from '../devicedashboard/AlertsCard';
import { EventLogsTable } from '../devicedashboard/EventsCard';

// import { useOutletContext } from 'react-router-dom';

// Sample data
const cpuData = [
  { name: '0min', value: 20 },
  { name: '5min', value: 35 },
  { name: '10min', value: 30 },
  { name: '15min', value: 45 },
  { name: '20min', value: 60 },
  { name: '25min', value: 80 },
  { name: '30min', value: 75 },
  
];

const memoryData = [
  { name: '0min', value: 40 },
  { name: '5min', value: 45 },
  { name: '10min', value: 50 },
  { name: '15min', value: 60 },
  { name: '20min', value: 85 },
  { name: '25min', value: 75 },
  { name: '30min', value: 85 },
 
];

const networkMap = {
  eth0: [
    { name: '0min', value: 50 },
    { name: '5min', value: 80 },
    { name: '10min', value: 60 },
    { name: '15min', value: 49 },
    { name: '20min', value: 90 },
    { name: '25min', value: 95 },
    { name: '30min', value: 50 },
   
  ],
  eth1: [
    { name: '0min', value: 40 },
    { name: '5min', value: 55 },
    { name: '10min', value: 72 },
    { name: '15min', value: 60 },
    { name: '20min', value: 85 },
    { name: '25min', value: 95 },
    { name: '30min', value: 78 },
    
  ],
  wifi: [
    { name: '0min', value: 30 },
    { name: '5min', value: 40 },
    { name: '10min', value: 35 },
    { name: '15min', value: 60 },
    { name: '20min', value: 45 },
    { name: '25min', value: 60 },
    { name: '30min', value: 55 },
    
  ]
};

const diskMap = {
  disk0: [
  { name: 'Used', value: 70, color: '#4F46E5' },
  { name: 'Free', value: 25, color: '#E5E7EB' },
  { name: 'Unallocated', value: 5, color: '#9CA3AF' }
  ],
  disk1: [
    {name: 'Used', value: 60, color: "#10B981" },
    { name: 'Free', value: 20, color: "#34D399" },
    {name: 'Unallocated', value: 20, color: "#6EE7B7" },
  ],
  disk2: [
    { name: 'Used', value: 50, color: "#F59E0B" },
    { name: 'Free', value: 25, color: "#FBBF24" },
    { name: 'Unallocated', value: 25, color: "#FCD34D" },
  ],
};
const initialAlerts = [
  {
    time: "2025-06-24 11:00:12",
    component: "CPU",
    severity: "Critical",
    description: "CPU usage exceeded 90% for over 5 minutes."
  },
  {
    time: "2025-06-24 11:05:44",
    component: "Memory",
    severity: "Warning",
    description: "Memory usage is consistently above 75%."
  },
  {
    time: "2025-06-24 11:10:31",
    component: "Disk",
    severity: "Info",
    description: "Disk /dev/sda1 cleaned up. 1.2GB space freed."
  },
  {
    time: "2025-06-24 11:13:12",
    component: "Network",
    severity: "Critical",
    description: "Packet loss detected on eth0 interface."
  },
  {
    time: "2025-06-24 11:20:22",
    component: "CPU",
    severity: "Warning",
    description: "Temperature nearing thermal limit (85°C)."
  },
  {
    time: "2025-06-24 11:25:40",
    component: "Disk",
    severity: "Critical",
    description: "Disk usage reached 99% on /data partition."
  },
  {
    time: "2025-06-24 11:30:18",
    component: "Network",
    severity: "Info",
    description: "Network interface eth1 reconnected."
  },
  {
    time: "2025-06-24 11:33:50",
    component: "Memory",
    severity: "Critical",
    description: "Memory swap usage exceeded safe threshold."
  }

]
const eventLogs = [
  { time: '2025-06-24 10:30:12', type: 'CONNECTION', component: 'WebSocket', description: 'WebSocket connection established' },
  { time: '2025-06-24 10:30:12', type: 'MONITORING', component: 'Partition C:', description: 'Partition used space increased' },
  { time: '2025-06-24 10:30:12', type: 'UPDATE', component: 'Partition C:', description: 'Partition used space increased' },
  { time: '2025-06-24 10:30:12', type: 'CONNECTION', component: 'WebSocket', description: 'WebSocket connection established' },
  { time: '2025-06-24 10:30:12', type: 'MONITORING', component: 'Partition C:', description: 'Partition used space increased' },
  { time: '2025-06-24 10:30:12', type: 'UPDATE', component: 'Partition C:', description: 'Partition used space increased' },
  { time: '2025-06-24 10:30:12', type: 'CONNECTION', component: 'WebSocket', description: 'WebSocket connection established' },
  { time: '2025-06-24 10:30:12', type: 'MONITORING', component: 'Partition C:', description: 'Partition used space increased' },
  { time: '2025-06-24 10:30:12', type: 'UPDATE', component: 'Partition C:', description: 'Partition used space increased' },
  { time: '2025-06-24 10:29:45', type: 'ERROR', component: 'Database', description: 'Connection timeout occurred' },
  { time: '2025-06-24 10:29:30', type: 'WARNING', component: 'API Gateway', description: 'Rate limit exceeded' },
  { time: '2025-06-24 10:29:15', type: 'INFO', component: 'Load Balancer', description: 'Health check passed' },
  { time: '2025-06-24 10:28:58', type: 'SUCCESS', component: 'Authentication', description: 'User login successful' },
  { time: '2025-06-24 10:28:42', type: 'MONITORING', component: 'CPU Monitor', description: 'CPU usage normalized' },
];
const Dashboard = ({isDarkMode}) => {
 
  return (

  <div className="z-80 ">

      {/* Your dashboard content inside here */}
      <div className="grid grid-cols-2 sm:grid-cols-[20rem_1fr] gap-4 w-full">
        <div>
          <SystemInfoCard isDarkMode={isDarkMode} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-4">
          <CPUCard isDarkMode={isDarkMode} cpuData={cpuData} />
          <MemoryCard isDarkMode={isDarkMode} memoryData={memoryData} />
          <NetworkCard isDarkMode={isDarkMode} networkMap={networkMap} />
          <DiskUsageCard isDarkMode={isDarkMode} diskMap={diskMap} />
        </div>
      </div>

      <div className="space-y-6">
        <AlertsCard isDarkMode={isDarkMode} initialAlerts={initialAlerts} />
        <EventLogsTable isDarkMode={isDarkMode} eventLogs={eventLogs} />
      </div>
    </div>

  );
};

export default Dashboard;