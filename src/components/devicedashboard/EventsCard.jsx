import React, { useState, useEffect, useRef } from 'react';
import { SlidersHorizontal, Search, Calendar, Download, RefreshCw } from 'lucide-react';



export const EventLogsTable = ({ isDarkMode = false,eventLogs }) => {
  const [selectedEventType, setSelectedEventType] = useState('All');
  const [selectedComponent, setSelectedComponent] = useState('All');
  const [selectedTimeRange, setSelectedTimeRange] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
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

  const clearAllFilters = () => {
    setSelectedEventType('All');
    setSelectedComponent('All');
    setSelectedTimeRange('All');
    setSearchTerm('');
  };

  return (
    <div className="space-y-4 px-2 sm:px-0">

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
            Total Eventlogs ({filteredLogs.length})
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
      </div>
  );
};