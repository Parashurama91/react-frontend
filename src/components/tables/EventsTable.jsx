import React from 'react';

const EventLogs = ({ eventLogs = [], isDarkMode = false }) => {
  const bgColor = isDarkMode ? '#1F2937' : '#FFFFFF';
  const borderColor = isDarkMode ? '#374151' : '#E5E7EB';
  const headerTextColor = isDarkMode ? '#D1D5DB' : '#6B7280';
  const textColor = isDarkMode ? '#FFFFFF' : '#525759';
  const rowBg = isDarkMode ? '#111827' : '#F9FAFB';

  return (
    <div
      className="p-6 rounded-lg shadow-md overflow-x-auto"
      style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}
    >
      <h3 className="text-lg font-semibold mb-4" style={{ color: textColor }}>
        Event Logs
      </h3>

      <table className="min-w-full text-sm">
        <thead>
          <tr style={{ color: headerTextColor }}>
            <th className="text-center px-4 py-2">Created at</th>
            <th className="text-center px-4 py-2">Event Type</th>
            <th className="text-center px-4 py-2">Component Type</th>
            <th className="text-center px-4 py-2">Description</th>
          </tr>
        </thead>
        <tbody>
          {eventLogs.map((log, index) => (
            <tr
              key={index}
              style={{
                backgroundColor: index % 2 === 0 ? rowBg : 'transparent',
                color: isDarkMode ? '#D1D5DB' : '#525759',
                textAlign: 'center'
              }}
            >
              <td className="px-4 py-2 text-center">{log.time}</td>
              <td className="px-4 py-2 text-center">
                <span
                  className="px-2 py-1 rounded text-xs font-medium inline-block w-24 text-center"
                  style={{
                    backgroundColor: 'transparent',
                    color: 'inherit'
                  }}
                >
                  {log.type}
                </span>
              </td>
              <td className="px-4 py-2 text-center">
                {log.component && log.component !== ''
                  ? log.component
                  : '------------'}
              </td>
              <td className="px-4 py-2 text-center">{log.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventLogs;
