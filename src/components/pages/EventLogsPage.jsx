import React, { useState, useEffect, useRef } from 'react';
import { SlidersHorizontal, Search, Calendar, Download, RefreshCw } from 'lucide-react';

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

const EventLogsPage = ({ isDarkMode = false }) => {
  const [selectedEventType, setSelectedEventType] = useState('All');
  const [selectedComponent, setSelectedComponent] = useState('All');
  const [selectedTimeRange, setSelectedTimeRange] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const dropdownRef = useRef(null);

  // Extract unique values for filters
  const eventTypes = ['All', ...Array.from(new Set(eventLogs.map(log => log.type)))];
  const components = ['All', ...Array.from(new Set(eventLogs.map(log => log.component)))];
  const timeRanges = ['All', 'Last Hour', 'Last 24 Hours', 'Last Week', 'Last Month'];

  // Enhanced filtering logic
  const filteredLogs = eventLogs.filter(log => {
    const eventTypeMatch = selectedEventType === 'All' || log.type === selectedEventType;
    const componentMatch = selectedComponent === 'All' || log.component === selectedComponent;
    const searchMatch = searchTerm === '' || 
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.component.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Time range filtering (simplified for demo)
    let timeMatch = true;
    if (selectedTimeRange !== 'All') {
      // In production, you'd implement proper date filtering here
      timeMatch = true;
    }
    
    return eventTypeMatch && componentMatch && searchMatch && timeMatch;
  });

  // Calculate dynamic statistics based on filtered logs
  const logStatistics = {
    total: filteredLogs.length,
    byType: filteredLogs.reduce((acc, log) => {
      acc[log.type] = (acc[log.type] || 0) + 1;
      return acc;
    }, {}),
    successRate: Math.round((filteredLogs.filter(log => 
      ['SUCCESS', 'CONNECTION', 'INFO'].includes(log.type)
    ).length / filteredLogs.length) * 100) || 0,
    warnings: filteredLogs.filter(log => 
      ['WARNING', 'ERROR'].includes(log.type)
    ).length
  };

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
      case 'Event Type':
        setSelectedEventType(value);
        break;
      case 'Component':
        setSelectedComponent(value);
        break;
      case 'Time Range':
        setSelectedTimeRange(value);
        break;
    }
    setShowFilterDropdown(false);
    setActiveFilter(null);
  };

  const getFilterOptions = (filterType) => {
    switch(filterType) {
      case 'Event Type': return eventTypes;
      case 'Component': return components;
      case 'Time Range': return timeRanges;
      default: return [];
    }
  };

  const getCurrentFilterValue = (filterType) => {
    switch(filterType) {
      case 'Event Type': return selectedEventType;
      case 'Component': return selectedComponent;
      case 'Time Range': return selectedTimeRange;
      default: return 'All';
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const handleExport = () => {
    const csvContent = [
      ['Created At', 'Event Type', 'Source', 'Description'],
      ...filteredLogs.map(log => [log.time, log.type, log.component, log.description])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `event-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const clearAllFilters = () => {
    setSelectedEventType('All');
    setSelectedComponent('All');
    setSelectedTimeRange('All');
    setSearchTerm('');
  };

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
        <h2 className="text-xl sm:text-2xl font-bold" style={{ color: isDarkMode ? '#FFFFFF' : '#525759' }}>
          Event Logs
        </h2>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="p-2 rounded-md transition-colors"
            style={{
              backgroundColor: isDarkMode ? '#374151' : '#E5E7EB',
              color: isDarkMode ? '#D1D5DB' : '#374151',
            }}
            title="Export CSV"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Active Filters Display */}
      {(selectedEventType !== 'All' || selectedComponent !== 'All' || selectedTimeRange !== 'All' || searchTerm) && (
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {searchTerm && (
            <span className="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-blue-100 text-blue-800">
              Search: "{searchTerm}"
              <button 
                onClick={() => setSearchTerm('')} 
                className="ml-1 sm:ml-2 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          )}
          {selectedEventType !== 'All' && (
            <span className="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-green-100 text-green-800">
              Type: {selectedEventType}
              <button 
                onClick={() => setSelectedEventType('All')} 
                className="ml-1 sm:ml-2 text-green-600 hover:text-green-800"
              >
                ×
              </button>
            </span>
          )}
          {selectedComponent !== 'All' && (
            <span className="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-purple-100 text-purple-800">
              Component: {selectedComponent}
              <button 
                onClick={() => setSelectedComponent('All')} 
                className="ml-1 sm:ml-2 text-purple-600 hover:text-purple-800"
              >
                ×
              </button>
            </span>
          )}
          {selectedTimeRange !== 'All' && (
            <span className="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-orange-100 text-orange-800">
              Time: {selectedTimeRange}
              <button 
                onClick={() => setSelectedTimeRange('All')} 
                className="ml-1 sm:ml-2 text-orange-600 hover:text-orange-800"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}

      {/* Logs Table */}
      <div
        className="rounded-lg shadow-md"
        style={{
          backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
          border: isDarkMode ? '1px solid #374151' : '1px solid #E5E7EB',
        }}
      >
        <div className="p-3 sm:p-4 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0">
        <div>
            <span className="text-base sm:text-lg font-semibold" style={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}>
            Total Logs ({filteredLogs.length})
            </span>
            {filteredLogs.length !== eventLogs.length && (
            <p className="text-xs sm:text-sm" style={{ color: isDarkMode ? '#D1D5DB' : '#6B7280' }}>
                Showing {filteredLogs.length} of {eventLogs.length} events
            </p>
            )}
        </div>

        {/* Moved Filter Dropdown */}
        <div className="relative scan" ref={dropdownRef}>
            <button
            onClick={() => setShowFilterDropdown(prev => !prev)}
            className="flex items-center gap-2 px-3 py-2 rounded-md border text-xs sm:text-sm"
            style={{
                backgroundColor: isDarkMode ? '#374151' : '#E5E7EB',
                borderColor: isDarkMode ? '#4B5563' : '#D1D5DB',
                color: isDarkMode ? '#FFFFFF' : '#1F2937',
            }}
            >
            <SlidersHorizontal className="w-4 h-4" />
            </button>

            {showFilterDropdown && (
            <div
                className="absolute right-0 mt-2 w-40 sm:w-48 rounded-md shadow-xl z-50"
                style={{
                backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                border: `1px solid ${isDarkMode ? '#374151' : '#E5E7EB'}`,
                }}
            >
                {['Event Type', 'Component', 'Time Range'].map((filter) => (
                <div
                    key={filter}
                    className="px-3 sm:px-4 py-2 text-xs sm:text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer relative"
                    onClick={(e) => {
                    e.stopPropagation();
                    setActiveFilter(activeFilter === filter ? null : filter);
                    }}
                    style={{ color: isDarkMode ? '#D1D5DB' : '#374151' }}
                >
                    <div className="flex justify-between items-center">
                    {filter}
                    <span className="text-xs text-gray-500 hidden sm:inline">
                        {getCurrentFilterValue(filter) !== 'All' ? getCurrentFilterValue(filter) : ''}
                    </span>
                    </div>

                    {activeFilter === filter && (
                    <div
                      className="absolute right-full top-0 translate-x-[-1px] w-44 rounded-md shadow-2xl border max-h-48 overflow-y-auto z-[110] custom-scroll"
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
                          className={`px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${
                            getCurrentFilterValue(filter) === item
                              ? 'bg-blue-50 dark:bg-blue-900/50'
                              : ''
                          }`}
                          style={{
                            color: isDarkMode ? '#D1D5DB' : '#374151',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                ))}

                {(selectedEventType !== 'All' || selectedComponent !== 'All' || selectedTimeRange !== 'All') && (
                <>
                    <hr style={{ borderColor: isDarkMode ? '#374151' : '#E5E7EB' }} />
                    <div
                    className="px-3 sm:px-4 py-2 text-xs sm:text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-red-600"
                    onClick={clearAllFilters}
                    >
                    Clear All Filters
                    </div>
                </>
                )}
            </div>
            )}
        </div>
        </div>


        {/* Scrollable container with narrower zebra background */}
        <div className="max-h-72 overflow-y-auto overflow-x-auto custom-scroll px-2 sm:px-4">
          <div className="max-w-4xl mx-auto">
            {eventLogs.length === 0 ? (
              <div className="text-center py-8" style={{ color: isDarkMode ? '#D1D5DB' : '#6B7280' }}>
                No event logs available.
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="text-center py-8" style={{ color: isDarkMode ? '#D1D5DB' : '#6B7280' }}>
                No event logs match the current filters.
              </div>
            ) : (
              <table className={`w-full text-xs text-left border-collapse font-medium tracking-wider min-w-[700px] ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <thead>
                  <tr className="sticky top-0 z-10 font-medium tracking-wider text-xs py-3 px-4" style={{ backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF' }}>
                    <th className="py-2 sm:py-3 px-2 sm:px-4 text-center">TIME</th>
                    <th className="py-2 sm:py-3 px-2 sm:px-4 text-center">EVENT TYPE</th>
                    <th className="py-2 sm:py-3 px-2 sm:px-4 text-center">SOURCE</th>
                    <th className="py-2 sm:py-3 px-2 sm:px-4 text-center">DESCRIPTION</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log, index) => (
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
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-center align-middle text-xs break-all">{log.time}</td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-center align-middle">
                        <span className="px-1 sm:px-2 py-1 rounded-full text-xs font-semibold text-center w-16 sm:w-24 inline-block">
                          {log.type}
                        </span>
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-center font-medium align-middle">{log.component}</td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-center align-middle break-words">{log.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Log Statistics */}
      <div
        className="p-4 sm:p-6 rounded-lg shadow-md grid grid-cols-1 sm:grid-cols-3 text-center gap-4 sm:gap-6"
        style={{
          backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
          border: isDarkMode ? '1px solid #374151' : '1px solid #E5E7EB',
        }}
      >
        <div>
          <p className="text-xl sm:text-2xl font-bold text-blue-500">{logStatistics.total}</p>
          <p className="text-xs sm:text-sm" style={{ color: isDarkMode ? '#D1D5DB' : '#6B7280' }}>
            {filteredLogs.length === eventLogs.length ? 'Total Events Today' : 'Filtered Events'}
          </p>
        </div>
        <div>
          <p className="text-xl sm:text-2xl font-bold text-green-500">{logStatistics.successRate}%</p>
          <p className="text-xs sm:text-sm" style={{ color: isDarkMode ? '#D1D5DB' : '#6B7280' }}>
            Success Rate
          </p>
        </div>
        <div>
          <p className="text-xl sm:text-2xl font-bold text-yellow-500">{logStatistics.warnings}</p>
          <p className="text-xs sm:text-sm" style={{ color: isDarkMode ? '#D1D5DB' : '#6B7280' }}>
            Warnings & Errors
          </p>
        </div>
      </div>
    </div>
  );
};
export default EventLogsPage;