import React, { useState, useCallback, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import {
  Server,
  Bell,
  FileText,
  Sun,
  Moon,
  Cpu,
  MemoryStick,
  HardDrive,
  Network,
  ChevronDown,
  ChevronRight,
  ActivityIcon
} from 'lucide-react';

const Sidebar = ({ isDarkMode, toggleTheme }) => {
  const [showHealthDropdown, setShowHealthDropdown] = useState(false);
  const location = useLocation();

  const handleHealthClick = useCallback((e) => {
    e.preventDefault();
    setShowHealthDropdown(prev => !prev); // Toggle the dropdown state
  }, []);

  // Automatically show/hide dropdown based on route
  useEffect(() => {
    const isHealthActive = location.pathname.startsWith('/health');
    setShowHealthDropdown(isHealthActive);
  }, [location.pathname]);

  const isHealthActive = location.pathname.startsWith('/health');

  const getNavLinkStyles = (isActive) => ({
    backgroundColor: isActive ? '#6366F1' : 'transparent',
    color: isActive ? '#FFFFFF' : isDarkMode ? '#D1D5DB' : '#374151'
  });

  const getDropdownItemStyles = (isActive) => ({
    backgroundColor: isActive ? '#E0E7FF' : 'transparent',
    color: isActive ? '#4338CA' : isDarkMode ? '#D1D5DB' : '#374151'
  });

  return (
    <aside
      className="fixed top-20 left-0 w-64 border-r transition-colors duration-300 flex flex-col z-40"
      style={{
        height: 'calc(100vh - 80px)',
        backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
        borderColor: isDarkMode ? '#374151' : '#E5E7EB'
      }}
      role="navigation"
      aria-label="Main navigation"
    >
      <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
        {/* Dashboard */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 active:scale-[0.98] ${
              isActive ? 'shadow-sm' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`
          }
          style={({ isActive }) => getNavLinkStyles(isActive)}
          aria-label="Dashboard"
        >
          <DashboardIcon className="w-5 h-5 flex-shrink-0" />
          <span className="truncate">Dashboard</span>
        </NavLink>

        {/* Devices */}
        <NavLink
          to="/devices"
          className={({ isActive }) =>
            `w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 active:scale-[0.98] ${
              isActive ? 'shadow-sm' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`
          }
          style={({ isActive }) => getNavLinkStyles(isActive)}
          aria-label="Devices"
        >
          <Server className="w-5 h-5 flex-shrink-0" />
          <span className="truncate">Devices</span>
        </NavLink>

        {/* Health Dropdown */}
        <div className="space-y-1">
          <div
            onClick={handleHealthClick}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 active:scale-[0.98] cursor-pointer ${
              isHealthActive ? 'shadow-sm' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            style={getNavLinkStyles(isHealthActive)}
            aria-expanded={showHealthDropdown}
            aria-controls="health-submenu"
            aria-label="Health menu"
          >
            <div className="flex items-center space-x-3">
              <ActivityIcon className="w-5 h-5 flex-shrink-0" />
              <span className="truncate">Health</span>
            </div>
            <div className="transform transition-transform duration-200">
              {showHealthDropdown ? (
                <ChevronDown className="w-4 h-4 flex-shrink-0" />
              ) : (
                <ChevronRight className="w-4 h-4 flex-shrink-0" />
              )}
            </div>
          </div>

          {/* Health Dropdown Items */}
          <div
            id="health-submenu"
            className={`pl-6 overflow-hidden transition-all duration-300 ease-in-out transform ${
              showHealthDropdown 
                ? 'max-h-[500px] opacity-100 translate-y-0' 
                : 'max-h-0 opacity-0 -translate-y-2'
            }`}
            role="menu"
            aria-label="Health submenu"
          >
            <div className="space-y-1 py-1">
              <NavLink
                to="/health/cpu"
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-all duration-200 active:scale-[0.98] ${
                    isActive ? 'shadow-sm' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
                style={({ isActive }) => getDropdownItemStyles(isActive)}
                role="menuitem"
                aria-label="CPU health"
              >
                <Cpu className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">CPU</span>
              </NavLink>

              <NavLink
                to="/health/memory"
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-all duration-200 active:scale-[0.98] ${
                    isActive ? 'shadow-sm' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
                style={({ isActive }) => getDropdownItemStyles(isActive)}
                role="menuitem"
                aria-label="Memory health"
              >
                <MemoryStick className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">Memory</span>
              </NavLink>

              <NavLink
                to="/health/storage"
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-all duration-200 active:scale-[0.98] ${
                    isActive ? 'shadow-sm' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
                style={({ isActive }) => getDropdownItemStyles(isActive)}
                role="menuitem"
                aria-label="Storage health"
              >
                <HardDrive className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">Storage</span>
              </NavLink>

              <NavLink
                to="/health/network"
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-all duration-200 active:scale-[0.98] ${
                    isActive ? 'shadow-sm' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
                style={({ isActive }) => getDropdownItemStyles(isActive)}
                role="menuitem"
                aria-label="Network health"
              >
                <Network className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">Network</span>
              </NavLink>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <NavLink
          to="/alerts"
          className={({ isActive }) =>
            `w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 active:scale-[0.98] ${
              isActive ? 'shadow-sm' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`
          }
          style={({ isActive }) => getNavLinkStyles(isActive)}
          aria-label="Alerts"
        >
          <Bell className="w-5 h-5 flex-shrink-0" />
          <span className="truncate">Alerts</span>
        </NavLink>

        {/* Event Logs */}
        <NavLink
          to="/event-logs"
          className={({ isActive }) =>
            `w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 active:scale-[0.98] ${
              isActive ? 'shadow-sm' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`
          }
          style={({ isActive }) => getNavLinkStyles(isActive)}
          aria-label="Event Logs"
        >
          <FileText className="w-5 h-5 flex-shrink-0" />
          <span className="truncate">Event Logs</span>
        </NavLink>
      </nav>

      {/* Theme Toggle */}
      <div
        className="p-4 border-t"
        style={{ borderColor: isDarkMode ? '#374151' : '#E5E7EB' }}
      >
        <button
          className="w-full flex justify-between items-center px-3 py-2 text-sm rounded-lg transition-all duration-200"
          style={{
            color: isDarkMode ? '#9CA3AF' : '#6B7280',
            fontWeight: 500
          }}
          aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} theme`}
        >
          <span>Theme</span>
          <div onClick={toggleTheme} className="flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-200 active:scale-[0.98]">
            {isDarkMode ? (
              <Moon className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Sun className="w-5 h-5" aria-hidden="true" />
            )}
          </div>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;