import React, { useState, useEffect, useRef } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import '../index.css'

const initialAlerts = [
  { time: '2025-06-24T10:30:12Z', component: 'CPU', severity: 'Warning', description: 'High CPU usage', device: 'WS-01' },
  { time: '2025-06-24T10:30:12Z', component: 'Storage', severity: 'Info', description: 'Disk Usage 50%', device: 'DB-02' },
  { time: '2025-06-24T10:30:12Z', component: 'Network', severity: 'Critical', description: 'Network Usage > 80%', device: 'WS-01' },
  { time: '2025-06-24T10:30:12Z', component: 'CPU', severity: 'Info', description: 'Disk Usage 50%', device: 'DB-02' },
  { time: '2025-06-24T10:30:12Z', component: 'CPU', severity: 'Warning', description: 'High CPU usage', device: 'LB-07' },
  { time: '2025-06-24T10:30:12Z', component: 'Storage', severity: 'Info', description: 'Disk Usage 50%', device: 'DB-02' },
  { time: '2025-06-24T10:30:12Z', component: 'Network', severity: 'Critical', description: 'Network Usage > 80%', device: 'WS-01' },
  { time: '2025-06-24T10:30:12Z', component: 'Network', severity: 'Info', description: 'Disk Usage 50%', device: 'LB-07' },
];

const severityColor = {
  Critical: 'bg-red-100 text-red-600 w-20',
  Warning: 'bg-yellow-100 text-yellow-700 w-20',
  Info: 'bg-green-100 text-green-600 w-20',
};

const AlertDashboard = ({ isDarkMode = false }) => {
  const [selectedDevice, setSelectedDevice] = useState('All');
  const [selectedComponent, setSelectedComponent] = useState('All');
  const [selectedSeverity, setSelectedSeverity] = useState('All');
  const [selectedTime, setSelectedTime] = useState('All');
  const [activeFilter, setActiveFilter] = useState(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const devices = ['All', ...Array.from(new Set(initialAlerts.map(a => a.device)))];
  const components = ['All', ...Array.from(new Set(initialAlerts.map(a => a.component)))];
  const severities = ['All', ...Array.from(new Set(initialAlerts.map(a => a.severity)))];
  const times = ['All', 'Last Hour', '1 Day', '7 Days', '30 Days'];

  // Enhanced filtering logic
  const filteredAlerts = initialAlerts.filter(alert => {
    const deviceMatch = selectedDevice === 'All' || alert.device === selectedDevice;
    const componentMatch = selectedComponent === 'All' || alert.component === selectedComponent;
    const severityMatch = selectedSeverity === 'All' || alert.severity === selectedSeverity;
    const timeMatch = (() => {
      if (selectedTime === 'All') return true;

      const alertTime = new Date(alert.time);
      const now = new Date();

      switch (selectedTime) {
        case 'Last Hour':
          return now - alertTime <= 60 * 60 * 1000;
        case '1 Day':
          return now - alertTime <= 24 * 60 * 60 * 1000;
        case '7 Days':
          return now - alertTime <= 7 * 24 * 60 * 60 * 1000;
        case '30 Days':
          return now - alertTime <= 30 * 24 * 60 * 60 * 1000;
        default:
          return true;
      }
    })();

    return deviceMatch && componentMatch && severityMatch && timeMatch;
  });

  // Calculate dynamic summary based on filtered alerts
  const alertSummary = filteredAlerts.reduce((acc, alert) => {
    acc[alert.severity] = (acc[alert.severity] || 0) + 1;
    return acc;
  }, {});

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowFilterDropdown(false);
        setActiveFilter(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFilterSelection = (filterType, value) => {
    switch(filterType) {
      case 'Device':
        setSelectedDevice(value);
        break;
      case 'Component':
        setSelectedComponent(value);
        break;
      case 'Severity':
        setSelectedSeverity(value);
        break;
      case 'Time':
        setSelectedTime(value);
        break;
    }
    setShowFilterDropdown(false);
    setActiveFilter(null);
  };

  const getFilterOptions = (filterType) => {
    switch(filterType) {
      case 'Device': return devices;
      case 'Component': return components;
      case 'Severity': return severities;
      case 'Time': return times;
      default: return [];
    }
  };

  const getCurrentFilterValue = (filterType) => {
    switch(filterType) {
      case 'Device': return selectedDevice;
      case 'Component': return selectedComponent;
      case 'Severity': return selectedSeverity;
      case 'Time': return selectedTime;
      default: return 'All';
    }
  };
  
  const clearAllFilters = () => {
    setSelectedDevice('All');
    setSelectedComponent('All');
    setSelectedSeverity('All');
    setSelectedTime('All');
    setActiveFilter(null);
    setShowFilterDropdown(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
        <h2 className="text-xl sm:text-2xl font-bold" style={{ color: isDarkMode ? '#FFF' : '#525759' }}>
          Alerts
        </h2>
      </div>

      {/* Active Filters Display */}
      {(selectedDevice !== 'All' || selectedComponent !== 'All' || selectedSeverity !== 'All' || selectedTime !== 'All') && (
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {selectedDevice !== 'All' && (
            <span className="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-blue-100 text-blue-800">
              Device: {selectedDevice}
              <button 
                onClick={() => setSelectedDevice('All')} 
                className="ml-1 sm:ml-2 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          )}
          {selectedComponent !== 'All' && (
            <span className="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-green-100 text-green-800">
              Component: {selectedComponent}
              <button 
                onClick={() => setSelectedComponent('All')} 
                className="ml-1 sm:ml-2 text-green-600 hover:text-green-800"
              >
                ×
              </button>
            </span>
          )}
          {selectedSeverity !== 'All' && (
            <span className="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-orange-100 text-orange-800">
              Severity: {selectedSeverity}
              <button 
                onClick={() => setSelectedSeverity('All')} 
                className="ml-1 sm:ml-2 text-orange-600 hover:text-orange-800"
              >
                ×
              </button>
            </span>
          )}
          {selectedTime !== 'All' && (
            <span className="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-purple-100 text-purple-800">
              Time: {selectedTime}
              <button 
                onClick={() => setSelectedTime('All')} 
                className="ml-1 sm:ml-2 text-purple-600 hover:text-purple-800"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}

      {/* Alerts Table */}
      <div
        className="rounded-lg shadow-md overflow-visible relative"
        style={{
          backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
          border: isDarkMode ? '1px solid #374151' : '1px solid #E5E7EB',
        }}
      >
        <div className="p-3 sm:p-4 flex justify-between items-center font-medium tracking-wider text-xs py-3 px-4 text-gray-600">
          <span className="text-base sm:text-lg font-semibold" style={{ color: isDarkMode ? '#FFF' : '#525759' }}>
           Total Alerts ({filteredAlerts.length})
          </span>

          {/* Filter Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              title="Filter"
              onClick={() => setShowFilterDropdown(prev => !prev)}
              className="p-2 rounded-md hover:opacity-80 transition-opacity"
              style={{
                backgroundColor: isDarkMode ? '#374151' : '#E5E7EB',
                color: isDarkMode ? '#D1D5DB' : '#374151',
              }}
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            {/* Main Filter Dropdown */}
            {showFilterDropdown && (
              <div
                className="absolute right-0 top-full mt-1 w-48 rounded-md shadow-2xl border z-[100]"
                style={{
                  backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                  borderColor: isDarkMode ? '#374151' : '#E5E7EB',
                }}
              >
                {['Device', 'Component', 'Severity', 'Time'].map((filter) => (
                  <div
                    key={filter}
                    className="relative"
                  >
                    <div
                      className="px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex justify-between items-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveFilter(activeFilter === filter ? null : filter);
                      }}
                      style={{ color: isDarkMode ? '#D1D5DB' : '#374151' }}
                    >
                      <span>{filter}</span>
                      <span className="text-xs text-gray-500">
                        {getCurrentFilterValue(filter) !== 'All' ? getCurrentFilterValue(filter) : ''}
                      </span>
                    </div>

                    {/* Submenu */}
                    {activeFilter === filter && (
                      <div
                        className="absolute right-full top-0 ml-1 w-40 rounded-md shadow-2xl border max-h-48 overflow-y-auto z-[110]"
                        style={{
                          backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                          borderColor: isDarkMode ? '#374151' : '#E5E7EB',
                        }}
                      >
                        {getFilterOptions(filter).map((item) => (
                          <div
                            key={item}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFilterSelection(filter, item);
                            }}
                            className={`px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                              getCurrentFilterValue(filter) === item ? 'bg-blue-50 dark:bg-blue-900/50' : ''
                            }`}
                            style={{ color: isDarkMode ? '#D1D5DB' : '#374151' }}
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {(selectedDevice !== 'All' || selectedComponent !== 'All' || selectedSeverity !== 'All' || selectedTime !== 'All') && (
                  <>
                    <hr className="my-1" style={{ borderColor: isDarkMode ? '#374151' : '#E5E7EB' }} />
                    <div
                      className="px-4 py-3 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer text-red-600 font-medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearAllFilters();
                      }}
                    >
                      Clear All Filters
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Scrollable Table */}
        <div className="max-h-72 overflow-y-auto overflow-x-auto px-2 sm:px-4 custom-scroll">
          <div className="max-w-5xl mx-auto">
            {initialAlerts.length === 0 ? (
            <div className="text-center py-8" style={{ color: isDarkMode ? '#D1D5DB' : '#6B7280' }}>
              No alerts available.
            </div>
          ) : filteredAlerts.length === 0 ? (
            <div className="text-center py-8" style={{ color: isDarkMode ? '#D1D5DB' : '#6B7280' }}>
              No alerts match the current filters.
            </div>
          ) : (
              <table className={`w-full text-xs text-left border-collapse font-medium tracking-wider min-w-[600px] ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <thead>
                  <tr className="sticky top-0 z-10 font-normal" style={{ backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF' }}>
                    <th className="py-2 sm:py-3 px-2 sm:px-4 text-center">TIME</th>
                    <th className="py-2 sm:py-3 px-2 sm:px-4 text-center">DEVICE</th>
                    <th className="py-2 sm:py-3 px-2 sm:px-4 text-center">COMPONENT</th>
                    <th className="py-2 sm:py-3 px-2 sm:px-4 text-center">SEVERITY</th>
                    <th className="py-2 sm:py-3 px-2 sm:px-4 text-center">DESCRIPTION</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAlerts.map((alert, index) => (
                    <tr
                      key={index}
                      className={`${
                        isDarkMode
                          ? index % 2 === 0
                            ? 'bg-gray-800'
                            : 'bg-gray-900'
                          : index % 2 === 0
                          ? 'bg-gray-50'
                          : 'bg-white'
                      }`}
                    >
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-center text-xs break-all">{alert.time}</td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-center">{alert.device}</td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-center font-medium">{alert.component}</td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-center">
                        <span
                          className={`px-1 sm:px-2 py-1 rounded-full text-xs font-medium inline-block ${severityColor[alert.severity]}`}
                        >
                          {alert.severity}
                        </span>
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-center">{alert.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Summary & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div
          className="p-4 sm:p-6 rounded-lg shadow-md"
          style={{
            backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
            border: isDarkMode ? '1px solid #374151' : '1px solid #E5E7EB',
          }}
        >
          <h3 className="text-base sm:text-lg font-semibold mb-4" style={{ color: isDarkMode ? '#FFFFFF' : '#525759' }}>
            Alert Summary (Filtered)
          </h3>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex justify-between">
              <span style={{ color: isDarkMode ? '#D1D5DB' : '#6B7280' }}>Critical</span>
              <span className="font-bold text-red-500">{alertSummary.Critical || 0}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: isDarkMode ? '#D1D5DB' : '#6B7280' }}>Warning</span>
              <span className="font-bold text-yellow-500">{alertSummary.Warning || 0}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: isDarkMode ? '#D1D5DB' : '#6B7280' }}>Info</span>
              <span className="font-bold text-blue-500">{alertSummary.Info || 0}</span>
            </div>
          </div>
        </div>

        <div
          className="p-4 sm:p-6 rounded-lg shadow-md"
          style={{
            backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
            border: isDarkMode ? '1px solid #374151' : '1px solid #E5E7EB',
          }}
        >
          <h3 className="text-base sm:text-lg font-semibold mb-4" style={{ color: isDarkMode ? '#FFFFFF' : '#525759' }}>
            Recent Activity
          </h3>
          <p style={{ color: isDarkMode ? '#D1D5DB' : '#6B7280' }}>
            {filteredAlerts.length} alerts shown ({filteredAlerts.length === initialAlerts.length ? 'all' : 'filtered'})
          </p>
        </div>
      </div>
    </div>
  );
};

export default AlertDashboard;