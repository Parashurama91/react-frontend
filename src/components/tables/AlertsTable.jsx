import React from 'react';
import { useNavigate } from 'react-router-dom';
import AlertTableBody from './AlertTableBody';

const AlertsTable = ({ alerts = [], isDarkMode = false }) => {
  const navigate = useNavigate();

  const bgColor = isDarkMode ? '#1F2937' : '#FFFFFF';
  const borderColor = isDarkMode ? '#374151' : '#E5E7EB';
  const cellTextColor = isDarkMode ? '#FFFFFF' : '#1F2937';
  const headerTextColor = isDarkMode ? '#D1D5DB' : '#6B7280';

  // Sort and pick the latest alert
  const latestAlert = [...alerts]
    .sort((a, b) => new Date(b.time) - new Date(a.time)) // most recent first
    .slice(0, 3); // pick only the latest one

  return (
    <div
      className="p-6 rounded-lg shadow-md flex flex-col justify-between h-full"
      style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}
    >
      <h3 className="text-lg font-semibold mb-4" style={{ color: cellTextColor }}>
        Recent Alert
      </h3>

      <div className="flex-1 mb-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: `1px solid ${borderColor}` }}>
              <th className="text-left py-3 px-2 font-medium" style={{ color: headerTextColor }}>
                Time
              </th>
              <th className="text-left py-3 px-2 font-medium" style={{ color: headerTextColor }}>
                Alert Type
              </th>
              <th className="text-left py-3 px-2 font-medium" style={{ color: headerTextColor }}>
                Device
              </th>
            </tr>
          </thead>
          <tbody>
            <AlertTableBody alerts={latestAlert} isDarkMode={isDarkMode} />
          </tbody>
        </table>
      </div>

      <div className="mt-auto text-right">
        <button
          onClick={() => navigate('/alerts')}
          className={`inline-flex items-center gap-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 shadow-sm
            ${isDarkMode 
              ? 'bg-[#6366F1] text-white hover:bg-[#4f46e5] hover:shadow-md' 
              : 'bg-[#DDEBFF] text-[#4F6EF7] hover:bg-[#C8DFFF] hover:shadow-md'}
              `}
        >
          View All Alerts →
        </button>
      </div>
    </div>
  );
};

export default AlertsTable;
