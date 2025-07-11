import React from 'react';
import { X } from 'lucide-react';

const Notification = ({ isDarkMode, notifications, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/10">
      <div
        className="rounded-xl p-6 max-w-xl w-full relative shadow-2xl border"
        style={{
          background: isDarkMode
            ? 'rgba(15, 23, 42, 0.8)'
            : 'rgba(246, 245, 248,1)',
          borderColor: isDarkMode
            ? 'rgba(51, 65, 85, 0.4)'
            : 'rgba(203, 213, 225, 0.3)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        {/* Close button */}
        <button
          className="absolute top-4 right-4 transition-all duration-200 hover:scale-110"
          onClick={onClose}
          style={{
            color: isDarkMode ? '#E2E8F0' : '#1E293B',
          }}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <h2
          className="text-xl font-semibold mb-5"
          style={{
            color: isDarkMode ? '#F1F5F9' : '#1E293B',
          }}
        >
          Notifications
        </h2>

        {/* Notifications list */}
        <div
          className="max-h-80 overflow-y-auto space-y-2"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {/* Hide scrollbars on Webkit */}
          <style>
            {`
              .no-scrollbar::-webkit-scrollbar {
                display: none;
              }
            `}
          </style>

          <div className="no-scrollbar">
            {notifications.length === 0 ? (
              <p
                className="text-sm text-center py-8"
                style={{
                  color: isDarkMode ? '#64748B' : '#94A3B8',
                }}
              >
                No notifications yet
              </p>
            ) : (
              notifications.map((note, index) => (
                <div key={note.id || index}>
                  <div
                    className="p-3 text-sm rounded-md transition-all duration-200 transform hover:scale-[1.05]"
                    style={{
                      color: isDarkMode ? '#E2E8F0' : '#334155',
                      cursor: 'pointer',
                    }}
                  >
                    {note.message || note}
                  </div>
                  {index < notifications.length - 1 && (
                    <div
                      className="h-px my-2"
                      style={{
                        background: isDarkMode
                          ? 'rgba(255,255,255,0.1)'
                          : 'rgba(0,0,0,0.05)',
                      }}
                    />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
