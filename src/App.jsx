import { useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Layout from './components/layout/Layout';
import { CPUDetails } from './components/devicemoredetails/CPUDetails';
import { DiskDetails } from './components/devicemoredetails/DiskDetails';
import { MemoryDetails } from './components/devicemoredetails/MemoryDetails';
import { NetworkDetails } from './components/devicemoredetails/NetworkDetails';
import { DiskIODetails } from './components/devicemoredetails/DiskIO';
import {CPUUsageCard} from './components/usageoverview/CPUUsage';
import { MemoryUsageCard } from './components/usageoverview/MemoryUsage';
import DiskUsageCard from './components/usageoverview/StorageUsage';

// Lazy-load pages
const Dashboard = lazy(() => import('./components/pages/Dashboard'));
const AlertPage = lazy(() => import('./components/pages/AlertPage'));
const EventLogsPage = lazy(() => import('./components/pages/EventLogsPage'));
const DevicesPage = lazy(() => import('./components/pages/DevicesPage'));
const Storage = lazy(() => import('./components/pages/Storage'));
const CPUHealth = lazy(() => import('./components/pages/Cpu'));
const MemoryHealth = lazy(() => import('./components/pages/Memory'));
const NetworkInterfaces = lazy(() => import('./components/pages/Network'));
const DashBoard = lazy(() => import('./components/devicedashboard/DashBoard'));

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Router>
      <Layout
        isDarkMode={isDarkMode}
        toggleTheme={() => setIsDarkMode(prev => !prev)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      >
        <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Dashboard isDarkMode={isDarkMode} />} />
            <Route path="/devices" element={<DevicesPage isDarkMode={isDarkMode} />} />
            <Route path="/devices/:id" element={<DashBoard isDarkMode={isDarkMode} />} />
            <Route path="/devices/:id/cpu_details" element={<CPUDetails isDarkMode={isDarkMode} />} />
            <Route path="/devices/:id/disk_details" element={<DiskDetails isDarkMode={isDarkMode} />} />
            <Route path="/devices/:id/diskio_details" element={<DiskIODetails isDarkMode={isDarkMode} />} />
            <Route path="/devices/:id/memory_details" element={<MemoryDetails isDarkMode={isDarkMode} />} />
            <Route path="/devices/:id/network_details" element={<NetworkDetails isDarkMode={isDarkMode} />} />
            <Route path="/alerts" element={<AlertPage isDarkMode={isDarkMode} />} />
            <Route path="/event-logs" element={<EventLogsPage isDarkMode={isDarkMode} />} />
            <Route path="/health/storage" element={<Storage isDarkMode={isDarkMode} />} />
            <Route path="/health/cpu" element={<CPUHealth isDarkMode={isDarkMode} />} />
            <Route path="/health/cpu/cpuoverview" element={<CPUUsageCard isDarkMode={isDarkMode} />} />
            <Route path="/health/memory/overview" element={<MemoryUsageCard isDarkMode={isDarkMode} />}/>
            <Route path="/health/storage/overview" element={<DiskUsageCard isDarkMode={isDarkMode} />}/>
            <Route path="/health/memory" element={<MemoryHealth isDarkMode={isDarkMode} />} />
            <Route path="/health/network" element={<NetworkInterfaces isDarkMode={isDarkMode} />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
};

export default App;
