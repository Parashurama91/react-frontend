
// import React from 'react';
// import PropTypes from 'prop-types';
// import StatCard from './charts/StatCard';
// import { Activity, Server, HardDrive, Bell } from 'lucide-react';

// const MetricsOverview = ({ data, isDarkMode }) => {
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-4 xl:grid-cols-4 gap-4">
//       <StatCard
//         title="Total Devices"
//         value={data.totalDevices}
//         color="#2563EB"
//         icon={Server}
//         isDarkMode={isDarkMode}
//       />
//       <StatCard
//         title="Active Devices"
//         value={data.activeDevices}
//         color="#10b981"
//         icon={Activity}
//         isDarkMode={isDarkMode}
//       />
//       <StatCard
//         title="Inactive Devices"
//         value={data.inactiveDevices}
//         color="#ef4444"
//         icon={HardDrive}
//         isDarkMode={isDarkMode}
//       />
//       <StatCard
//         title="Recent Alerts"
//         value={data.recentAlerts}
//         color="#F59E0B"
//         icon={Bell}
//         isDarkMode={isDarkMode}
//       />
//     </div>
//   );
// };

// MetricsOverview.propTypes = {
//   data: PropTypes.shape({
//     totalDevices: PropTypes.number,
//     activeDevices: PropTypes.number,
//     inactiveDevices: PropTypes.number,
//     recentAlerts: PropTypes.number
//   }).isRequired,
//   isDarkMode: PropTypes.bool
// };

// export default MetricsOverview;

import React from 'react';
import PropTypes from 'prop-types';
import StatCard from './charts/StatCard';
import { Activity, Server, HardDrive, Bell } from 'lucide-react';

const MetricsOverview = ({ data, isDarkMode }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 xl:grid-cols-4 gap-4">
      <StatCard
        title="Total Devices"
        value={data.totalDevices}
        color="#2563EB" // Blue
        icon={Server}
        isDarkMode={isDarkMode}
      />
      <StatCard
        title="Active Devices"
        value={data.activeDevices}
        color="#10b981" // Green
        icon={Activity}
        isDarkMode={isDarkMode}
      />
      <StatCard
        title="Inactive Devices"
        value={data.inactiveDevices}
        color="#ef4444" // Red
        icon={HardDrive}
        isDarkMode={isDarkMode}
      />
      <StatCard
        title="Recent Alerts"
        value={data.recentAlerts}
        color="#F59E0B" // Amber
        icon={Bell}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

MetricsOverview.propTypes = {
  data: PropTypes.shape({
    totalDevices: PropTypes.number,
    activeDevices: PropTypes.number,
    inactiveDevices: PropTypes.number,
    recentAlerts: PropTypes.number
  }).isRequired,
  isDarkMode: PropTypes.bool
};

export default MetricsOverview;
