import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Settings, User, Bell, RefreshCcw } from 'lucide-react';
import PropTypes from 'prop-types';
import '../index.css'

const Header = ({
  isDarkMode = false,
  toggleTheme,
  searchQuery = '',
  setSearchQuery,
  setShowNotificationModal,
  notifications = [],
  setNotifications,
  onRefresh,
  userEmail = 'user@example.com',
  onLogout,
  onPersonalize,
  className = '',
  ...props
}) => {
  const dropdownRef = useRef(null);
  const [refreshInterval, setRefreshInterval] = useState(10);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshIntervalRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Memoized functions to prevent unnecessary re-renders
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, [setNotifications]);

  const viewAllNotifications = useCallback(() => {
    setShowNotificationModal(true);
    setOpenDropdown(null);
  }, [setShowNotificationModal]);

  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      if (onRefresh) {
        await onRefresh();
      }
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [onRefresh, isRefreshing]);

  const toggleDropdown = useCallback((name) => {
    setOpenDropdown(prev => (prev === name ? null : name));
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, [setSearchQuery]);

  const handleRefreshIntervalChange = useCallback((interval) => {
    setRefreshInterval(interval);
    setOpenDropdown(null);
  }, []);

  const handleUserAction = useCallback((action) => {
    setOpenDropdown(null);
    if (action === 'logout' && onLogout) {
      onLogout();
    } else if (action === 'personalize' && onPersonalize) {
      onPersonalize();
    }
  }, [onLogout, onPersonalize]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle escape key to close dropdowns
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setOpenDropdown(null);
      }
    };
    
    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, []);

  // Auto-refresh functionality
  useEffect(() => {
    if (onRefresh && refreshInterval > 0) {
      refreshIntervalRef.current = setInterval(() => {
        handleRefresh();
      }, refreshInterval * 1000);

      return () => {
        if (refreshIntervalRef.current) {
          clearInterval(refreshIntervalRef.current);
        }
      };
    }
  }, [refreshInterval, onRefresh, handleRefresh]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, []);

  const headerStyles = {
    backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.7)' : 'rgba(255, 255, 255, 0.7)',
    borderColor: isDarkMode ? '#374151' : '#E5E7EB',
  };

  const inputStyles = {
    backgroundColor: isDarkMode ? '#374151' : '#F3F4F6',
    borderColor: isDarkMode ? '#4B5563' : '#D1D5DB',
    color: isDarkMode ? '#FFFFFF' : '#1F2937',
  };

  const buttonStyles = {
    backgroundColor: isDarkMode ? '#374151' : '#F3F4F6',
    color: isDarkMode ? '#D1D5DB' : '#6B7280',
  };

  const dropdownStyles = {
    backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
    borderColor: isDarkMode ? '#374151' : '#E5E7EB',
  };

  const textColor = isDarkMode ? '#FFFFFF' : '#1F2937';
  const secondaryTextColor = isDarkMode ? '#D1D5DB' : '#374151';
  const borderColor = isDarkMode ? '#374151' : '#E5E7EB';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-20 px-6 py-4 border-b backdrop-blur-md bg-opacity-70 transition-colors duration-300 ${className}`}
      style={headerStyles}
      {...props}
    >
      <div className="flex items-center justify-between">
        <h1 
          className="text-xl font-bold" 
          style={{ color: textColor }}
          aria-label="Genesis Application"
        >
          GENESIS
        </h1>

        <div className="flex items-center space-x-4" ref={dropdownRef}>
          {/* Search */}
          <div className="relative hidden sm:block">
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
              aria-hidden="true"
            />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              style={inputStyles}
              aria-label="Search"
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('notifications')}
              className="p-2 rounded-lg transition-colors duration-300 hover:opacity-80 transition-all duration-200 active:scale-[0.98] custom-scroll"
              style={buttonStyles}
              aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
              aria-expanded={openDropdown === 'notifications'}
              aria-haspopup="true"
            >
              <Bell className={`w-5 h-5 ${unreadCount > 0 ? 'animate-bounce' : ''}`} />
              {unreadCount > 0 && (
                <span 
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center ring-1 ring-white"
                  aria-label={`${unreadCount} unread notifications`}
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {openDropdown === 'notifications' && (
              <div
                className="absolute right-0 mt-2 w-64 rounded-lg shadow-lg border z-30 transition-all duration-200 flex flex-col"
                style={dropdownStyles}
                role="menu"
                aria-label="Notifications menu"
              >
                <div
                  className="p-3 font-semibold text-sm border-b"
                  style={{ color: textColor, borderColor }}
                >
                  Notifications
                </div>

                <div
                  className="overflow-y-auto text-sm max-h-56"
                  style={{ color: secondaryTextColor }}
                >
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No notifications
                    </div>
                  ) : (
                    notifications
                      .slice()
                      .sort((a, b) => new Date(b.time || 0) - new Date(a.time || 0))
                      .slice(0, 4)
                      .map((note) => (
                        <div
                          key={note.id}
                          className={`p-3 cursor-pointer rounded-md mx-2 mb-1 transition-colors ${
                            isDarkMode
                              ? 'hover:bg-gray-700 hover:bg-opacity-40'
                              : 'hover:bg-gray-100'
                          } ${!note.read ? 'font-semibold' : 'font-normal'}`}
                          role="menuitem"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              // Handle notification click if needed
                            }
                          }}
                        >
                          {note.message}
                          {note.time && (
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(note.time).toLocaleString()}
                            </div>
                          )}
                        </div>
                      ))
                  )}
                </div>

                <div
                  className="flex justify-between gap-2 px-3 py-3 border-t"
                  style={{ borderColor }}
                >
                  <button
                    onClick={markAllAsRead}
                    disabled={unreadCount === 0}
                    className={`w-full text-xs font-medium py-1.5 rounded-md transition text-center disabled:opacity-50 disabled:cursor-not-allowed ${
                      isDarkMode
                        ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 disabled:hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:hover:bg-gray-100'
                    }`}
                  >
                    Mark All as Read
                  </button>
                  <button
                    onClick={viewAllNotifications}
                    className={`w-full text-xs font-medium py-1.5 rounded-md transition text-center ${
                      isDarkMode
                        ? 'bg-blue-600 text-white hover:bg-blue-500'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                  >
                    View All
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('settings')}
              className="p-2 rounded-lg transition-colors duration-300 hover:opacity-80 transition-all duration-200 active:scale-[0.98]"
              style={buttonStyles}
              aria-label="Settings"
              aria-expanded={openDropdown === 'settings'}
              aria-haspopup="true"
            >
              <Settings className="w-5 h-5" />
            </button>

            {openDropdown === 'settings' && (
              <div
                className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg border z-30 transition-all duration-200"
                style={dropdownStyles}
                role="menu"
                aria-label="Settings menu"
              >
                <button
                  onClick={() => {
                    handleRefresh();
                    setOpenDropdown(null);
                  }}
                  disabled={isRefreshing}
                  className="flex items-center gap-2 w-full px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ color: secondaryTextColor }}
                  role="menuitem"
                >
                  <RefreshCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  {isRefreshing ? 'Refreshing...' : 'Refresh Now'}
                </button>

                <div className="border-t my-1" style={{ borderColor }} />

                <div 
                  className="px-4 py-2 text-sm font-medium" 
                  style={{ color: secondaryTextColor }}
                >
                  Auto-Refresh Rate
                </div>
                {[1, 2, 5, 15, 30].map((val) => (
                  <button
                    key={val}
                    onClick={() => handleRefreshIntervalChange(val)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition ${
                      refreshInterval === val ? 'font-semibold text-blue-500' : ''
                    }`}
                    style={{ color: refreshInterval === val ? undefined : secondaryTextColor }}
                    role="menuitem"
                  >
                    Every {val} minutes
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('user')}
              className="p-2 rounded-lg transition-colors duration-300 hover:opacity-80 active:scale-[0.98]"
              style={buttonStyles}
              aria-label="User menu"
              aria-expanded={openDropdown === 'user'}
              aria-haspopup="true"
            >
              <User className="w-5 h-5" />
            </button>

            {openDropdown === 'user' && (
              <div
                className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg border z-30"
                style={dropdownStyles}
                role="menu"
                aria-label="User menu"
              >
                <div className="p-3 border-b" style={{ borderColor }}>
                  <p className="text-sm truncate" style={{ color: textColor }} title={userEmail}>
                    {userEmail}
                  </p>
                </div>
                <div className="p-2">
                  <button 
                    onClick={() => handleUserAction('personalize')}
                    className="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    role="menuitem"
                  >
                    <span style={{ color: secondaryTextColor }}>Personalize</span>
                  </button>
                  <button 
                    onClick={() => handleUserAction('logout')}
                    className="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    role="menuitem"
                  >
                    <span style={{ color: secondaryTextColor }}>Log out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  isDarkMode: PropTypes.bool,
  toggleTheme: PropTypes.func,
  searchQuery: PropTypes.string,
  setSearchQuery: PropTypes.func.isRequired,
  setShowNotificationModal: PropTypes.func.isRequired,
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      message: PropTypes.string.isRequired,
      read: PropTypes.bool.isRequired,
      time: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
    })
  ),
  setNotifications: PropTypes.func.isRequired,
  onRefresh: PropTypes.func,
  userEmail: PropTypes.string,
  onLogout: PropTypes.func,
  onPersonalize: PropTypes.func,
  className: PropTypes.string,
};

export default Header;