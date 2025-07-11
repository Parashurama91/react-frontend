import React, { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";
const storageData = [
  { device: "Windows 2.1.9200", diskname: "PhysicalDrive0", fstype: "ext4", size: "100GB", used: "50GB", free: "50GB", percentage: 50, trend: 'stable', trendValue: 0 },
  { device: "A2", diskname: "/", fstype: "ext4", size: "100GB", used: "70GB", free: "30GB", percentage: 70, trend: 'up', trendValue: 3.2 },
  { device: "A3", diskname: "/", fstype: "ext4", size: "100GB", used: "90GB", free: "10GB", percentage: 90, trend: 'up', trendValue: 5.1 },
  { device: "B1", diskname: "/", fstype: "ext4", size: "1TB", used: "900GB", free: "100GB", percentage: 90, trend: 'up', trendValue: 2.4 },
  { device: "B2", diskname: "/", fstype: "ext4", size: "1TB", used: "850GB", free: "150GB", percentage: 85, trend: 'down', trendValue: -1.1 },
  { device: "B3", diskname: "/", fstype: "ext4", size: "1TB", used: "800GB", free: "200GB", percentage: 80, trend: 'stable', trendValue: 0 },
  { device: "C1", diskname: "/", fstype: "ext4", size: "500GB", used: "100GB", free: "400GB", percentage: 20, trend: 'down', trendValue: -2.2 },
  { device: "C2", diskname: "/", fstype: "ext4", size: "500GB", used: "200GB", free: "300GB", percentage: 40, trend: 'up', trendValue: 0.8 },
  { device: "C3", diskname: "/", fstype: "ext4", size: "500GB", used: "300GB", free: "200GB", percentage: 60, trend: 'up', trendValue: 1.7 },
  { device: "C2", diskname: "/", fstype: "ext4", size: "500GB", used: "200GB", free: "300GB", percentage: 40, trend: 'up', trendValue: 0.8 },
  { device: "C3", diskname: "/", fstype: "ext4", size: "500GB", used: "300GB", free: "200GB", percentage: 60, trend: 'up', trendValue: 1.7 },
];

const parseStorage = (str) => {
  const units = { MB: 1, GB: 1024, TB: 1024 * 1024 };
  const match = str.match(/^([\d.]+)([A-Z]+)$/);
  if (!match) return 0;
  const [, num, unit] = match;
  return parseFloat(num) * (units[unit] || 1);
};

const getTrendIcon = (trend, value) => {
  if (trend === 'up') return <TrendingUp className="w-4 h-4 text-red-500" title={`Increasing by ${value}%`} />;
  if (trend === 'down') return <TrendingDown className="w-4 h-4 text-green-500" title={`Decreasing by ${Math.abs(value)}%`} />;
  return <Minus className="w-4 h-4 text-gray-400" title="Stable" />;
};

const getUsageColor = (usage) => {
  if (usage === 0) return 'bg-green-500';
  if (usage <= 10) return 'bg-green-500';
  if (usage <= 30) return 'bg-yellow-500';
  if (usage <= 70) return 'bg-orange-500';
  return 'bg-red-500';
};

const getUsageBarColor = (usage) => {
  if (usage === 0) return 'bg-green-400';
  if (usage <= 10) return 'bg-green-400';
  if (usage <= 30) return 'bg-yellow-400';
  if (usage <= 70) return 'bg-orange-400';
  return 'bg-red-400';
};

const compareValues = (a, b, field, direction) => {
  let valA = a[field];
  let valB = b[field];

  if (["size", "used", "free"].includes(field)) {
    valA = parseStorage(valA);
    valB = parseStorage(valB);
  }

  if (valA < valB) return direction === "asc" ? -1 : 1;
  if (valA > valB) return direction === "asc" ? 1 : -1;
  return 0;
};

const Storage = ({ isDarkMode = true }) => {
  const [sortStack, setSortStack] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const toggleSort = (field) => {
    setSortStack((prev) => {
      const foundIndex = prev.findIndex((s) => s.field === field);

      if (foundIndex !== -1) {
        const currentDirection = prev[foundIndex].direction;

        if (currentDirection === "asc") {
          const updated = [...prev];
          updated[foundIndex] = { field, direction: "desc" };
          return updated;
        } else if (currentDirection === "desc") {
          return prev.filter((_, index) => index !== foundIndex);
        }
      }

      return [...prev, { field, direction: "asc" }];
    });
  };

  const getSortArrow = (field) => {
    const found = sortStack.find((s) => s.field === field);
    if (!found) return null;
    return found.direction === "asc" ? <ChevronUp className="w-3 h-3 ml-1 inline" /> : <ChevronDown className="w-3 h-3 ml-1 inline" />;
  };

  const filteredRows = useMemo(() => {
    let rows = [...storageData];
    if (searchTerm.trim()) {
      rows = rows.filter(row =>
        row.device.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.fstype.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    for (const { field, direction } of sortStack) {
      rows.sort((a, b) => compareValues(a, b, field, direction));
    }

    return rows;
  }, [searchTerm, sortStack]);

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      <div className="rounded-lg shadow-md overflow-visible relative" style={{ backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF', border: isDarkMode ? '1px solid #374151' : '1px solid #E5E7EB' }}>
        <div className="p-3 sm:p-4 flex justify-between items-center flex-wrap gap-2 font-medium tracking-wider text-sm text-gray-600">
          <span className="text-base sm:text-lg font-semibold" style={{ color: isDarkMode ? '#FFF' : '#525759' }}>Storage Devices ({filteredRows.length})</span>
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search devices or types..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 pr-4 py-1.5 rounded-md border text-sm shadow-sm w-full focus:outline-none focus:ring-2 ${isDarkMode ? 'bg-[#1F2937] text-white border-[#374151] placeholder-gray-400 focus:ring-blue-500' : 'bg-gray-100 text-gray-800 border-gray-300 placeholder-gray-400 focus:ring-blue-300'}`}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" clipRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.82 4.82a1 1 0 01-1.42 1.42l-4.82-4.82A6 6 0 012 8z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="max-h-[25rem] overflow-y-auto overflow-x-auto px-2 sm:px-4 custom-scroll">
          <div className="max-w-5xl mx-auto">
            {filteredRows.length === 0 ? (
              <div className="text-center py-8" style={{ color: isDarkMode ? '#D1D5DB' : '#6B7280' }}>
                No devices match your search.
              </div>
            ) : (
              <table className={`w-full text-sm text-left border-collapse font-medium tracking-wider min-w-[600px] ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <thead>
                  <tr className="sticky top-0 z-10 font-normal" style={{ backgroundColor: isDarkMode ? '#111827' : '#f2f5f7' }}>
                    <th className="py-2 px-4">Device</th>
                    <th className="py-2 px-4">Disk</th>
                    <th className="py-2 px-4">Type</th>
                    {['size', 'used', 'free', 'percentage'].map((key) => (
                      <th key={key} onClick={() => toggleSort(key)} className="py-2 px-4 cursor-pointer">
                        <div className="flex items-center capitalize">
                          {key === 'percentage' ? 'Usage' : key}
                          {getSortArrow(key)}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((row,index) => (
                    <tr key={row.id}
                      onClick={() => navigate(`/health/storage/overview`)}
                      className={`cursor-pointer hover:opacity-80 transition-opacity ${isDarkMode ? (index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900') : (index % 2 === 0 ? 'bg-gray-50' : 'bg-white')}`}
                    >
                      <td className="py-2 px-4 flex items-center">
                        <div className="w-1 h-6 bg-cyan-400 rounded-full mr-2"></div>
                        {row.device}
                      </td>
                      <td className="py-2 px-4">{row.diskname}</td>
                      <td className="py-2 px-4">{row.fstype}</td>
                      <td className="py-2 px-4">{row.size}</td>
                      <td className="py-2 px-4">{row.used}</td>
                      <td className="py-2 px-4">{row.free}</td>
                      <td className="py-2 px-4">
                        <div className="flex items-center gap-2">
                          {getTrendIcon(row.trend, row.trendValue)}
                          <div className="relative w-[100px] h-[8px] rounded-full bg-gray-300 dark:bg-[#374151] overflow-hidden">
                            <div className={`absolute top-0 left-0 h-full ${getUsageBarColor(row.percentage)} rounded-full`} style={{ width: `${row.percentage}%` }}></div>
                          </div>
                          <span className={`text-xs font-semibold text-white px-2 py-0.5 rounded ${getUsageColor(row.percentage)} min-w-[36px] text-center`}>
                            {row.percentage}%
                          </span>
                        </div>
                      </td>
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

export default Storage;
